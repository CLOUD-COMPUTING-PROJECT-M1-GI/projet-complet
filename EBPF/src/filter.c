#include <linux/bpf.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/in.h>
#include <bpf/bpf_helpers.h>

struct {
    __uint(type, BPF_MAP_TYPE_HASH);
    __uint(max_entries, 10000);
    __type(key, __u32);
    __type(value, __u64);
} packet_count SEC(".maps");

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 256 * 1024);
} rb SEC(".maps");

struct event {
    __u32 src_ip;
    __u32 dst_ip;
    __u16 src_port;
    __u16 dst_port;
    __u32 len;
    __u8 is_https;
};

SEC("xdp")
int xdp_filter(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    
    struct ethhdr *eth = data;
    if ((void*)(eth + 1) > data_end)
        return XDP_PASS;
        
    if (eth->h_proto != bpf_htons(ETH_P_IP))
        return XDP_PASS;
        
    struct iphdr *ip = (void*)(eth + 1);
    if ((void*)(ip + 1) > data_end)
        return XDP_PASS;
        
    if (ip->protocol != IPPROTO_TCP)
        return XDP_PASS;
        
    struct tcphdr *tcp = (void*)(ip + 1);
    if ((void*)(tcp + 1) > data_end)
        return XDP_PASS;
    
    __u16 dst_port = bpf_ntohs(tcp->dest);
    
    struct event *e;
    e = bpf_ringbuf_reserve(&rb, sizeof(*e), 0);
    if (!e)
        return XDP_PASS;
        
    e->src_ip = ip->saddr;
    e->dst_ip = ip->daddr;
    e->src_port = bpf_ntohs(tcp->source);
    e->dst_port = dst_port;
    e->len = bpf_ntohs(ip->tot_len);
    e->is_https = (dst_port == 443);
    
    bpf_ringbuf_submit(e, 0);
    
    if (dst_port == 443)
        return XDP_PASS;
    else if (dst_port == 80)
        return XDP_DROP;
        
    return XDP_PASS;
}

char LICENSE[] SEC("license") = "GPL";