# eBPF Network Monitor & HTTPS Filter

Real-time network monitoring and HTTP traffic filtering using eBPF/XDP. This tool provides deep visibility into network traffic while automatically blocking non-HTTPS requests.

## Features

- Real-time network traffic monitoring at XDP level
- Automatic blocking of plain HTTP traffic (port 80)
- HTTPS traffic analysis and metrics collection
- Live traffic visualization with detailed statistics
- High-performance packet processing using eBPF
- Docker support for containerized environments

## Prerequisites

- Linux kernel >= 5.5
- BCC tools installed
- Python 3.8 or higher
- libbpf-tools
- clang & LLVM

### System Dependencies Installation

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    bpfcc-tools \
    linux-headers-$(uname -r) \
    python3-bpfcc \
    clang \
    llvm

# Fedora/RHEL
sudo dnf install -y \
    bcc-tools \
    kernel-headers \
    python3-bcc \
    clang \
    llvm
```

## Project Structure

```
.
├── src/
│   ├── filter.c          # eBPF/XDP program
│   └── monitor.py        # User-space monitoring program
└── README.md            # This file
```

## Usage

### Direct System Installation

1. Start the monitor:
```bash
sudo python3 src/monitor.py
```

2. Monitor output will show:
- Source and destination IP addresses
- Port numbers
- Protocol (HTTP/HTTPS)
- Packet lengths
- Real-time statistics

### Docker Usage
. Run the container:
```bash
docker run --privileged -v /lib/modules:/lib/modules:ro \
    -v /usr/src:/usr/src:ro \
    -v /etc/localtime:/etc/localtime:ro \
    --net=host \
    ebpf-monitor
```

## Configuration

The program uses default network interface `eth0`. To change this, modify the interface name in `src/monitor.py`:

```python
idx = ipr.link_lookup(ifname="your_interface_name")[0]
```

## Security Considerations

- Requires root privileges due to eBPF/XDP functionality
- Modifies system network configuration
- Should be run in controlled environments only
- Care should be taken when deploying in production

## Performance Impact

- Minimal CPU overhead due to XDP integration
- Memory usage scales with traffic volume
- Negligible latency impact on network operations

## Troubleshooting

Common issues and solutions:

1. **XDP attachment fails**:
   - Verify kernel version compatibility
   - Check interface driver XDP support
   - Ensure BPF verification passes

2. **Permission denied**:
   - Run with sudo
   - Verify BPF filesystem mount
   - Check SELinux/AppArmor settings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Authors

Your Name (@Tiger-Foxx)

## Acknowledgments

- Linux eBPF maintainers
- BCC project contributors
- XDP development team