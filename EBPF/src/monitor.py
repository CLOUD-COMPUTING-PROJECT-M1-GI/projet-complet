from bcc import BPF
from pyroute2 import IPRoute
import ctypes as ct
import time
import socket
import struct

with open('filter.c', 'r') as f:
    bpf_program = f.read()

b = BPF(text=bpf_program)

#on atacher le programme XDP à l'interface
ipr = IPRoute()
idx = ipr.link_lookup(ifname="eth0")[0]
b.attach_xdp(idx, b["xdp_filter"])

class Event(ct.Structure):
    _fields_ = [
        ("src_ip", ct.c_uint32),
        ("dst_ip", ct.c_uint32),
        ("src_port", ct.c_uint16),
        ("dst_port", ct.c_uint16),
        ("len", ct.c_uint32),
        ("is_https", ct.c_uint8)
    ]

def ip_to_str(addr):
    return socket.inet_ntoa(struct.pack("I", addr))

#Callback pour le buffer circulaire
def process_event(cpu, data, size):
    event = ct.cast(data, ct.POINTER(Event)).contents
    print(f"{'HTTPS' if event.is_https else 'HTTP'} "
          f"{ip_to_str(event.src_ip)}:{event.src_port} -> "
          f"{ip_to_str(event.dst_ip)}:{event.dst_port} "
          f"len={event.len}")

# Boucle principal
b.ring_buffer_consume()
b["rb"].open_ring_buffer(process_event)

print("Surveillance du trafic réseau en cours... Ctrl+C pour arrêter")
try:
    while True:
        b.ring_buffer_poll()
        time.sleep(0.1)
except KeyboardInterrupt:
    print("Arrêt de la surveillance...")
    b.remove_xdp(idx)