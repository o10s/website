---
title: The Beginning
date: 2024-01-20T19:47:46+01:00
draft: true
tags: 
- Homelab
- Kubernetes
- Proxmox
- Terraform
- Ansible
categories: 
- Technology
cover:
  image: "images/posts/homelab/beginning.png"
  alt: "The cover image for the post"
  relative: false 
---

# Create a template in proxmox

Connect to your proxmox server with an account that can do the commands below via ssh

Download the latest image of the ubuntu cloud image available here: https://cloud-images.ubuntu.com/
```shell
wget https://cloud-images.ubuntu.com/noble/20240104/noble-server-cloudimg-amd64.img
```

Create a new virtual machine
```shell
qm create 9999 --memory 8192 --core 4 --name ubuntu-cloud --net0 virtio,bridge=vmbr0
```

Import the downloaded Ubuntu disk to VMs storage
```shell
qm importdisk 9999 noble-server-cloudimg-amd64.img VMs
```

Attach the new disk to the vm as a scsi drive on the scsi controller
```shell
qm set 9999 --scsihw virtio-scsi-pci --scsi0 VMs:vm-9999-disk-0
```

Add cloud init drive
```shell
qm set 9999 --ide2 VMs:cloudinit
```

Make the cloud init drive bootable and restrict BIOS to boot from disk only
```shell
qm set 9999 --boot c --bootdisk scsi0
```

Add serial console
```shell
qm set 9999 --serial0 socket --vga serial0
```

Create template
```shell
qm template 9999
```

# Use terraform to setup three initial machines

Customize the deployment vars to your liking

Initialize your project
```shell
terraform init
```

Plan the deployement
```shell
terraform plan
```

Apply the deployment
```shell
terraform apply
```

Notes: Sometimes the apply steps stays running despite the VMs being deployed entirely in this case
1 - Cancel the Terraform job with ctrl+c 

Try to connect to each machine via ssh you should not need password and you must accept 
```shell
ssh <USER>@<IP>
```

# Use ansible to setup the nodes

First follow the first playbook then follow this one follow this https://github.com/k3s-io/k3s-ansible

The first playbook installs required dependencies and also creates a storage path for longhorn

The second installs k3s in HA mode

# Install argocd via helm and ansible

run the following to make sure ansible helm module is installed:
```shell
ansible-galaxy collection install kubernetes.core 
```

run the setup initial kube playbook