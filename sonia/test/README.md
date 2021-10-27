# terraform ec2

```
ssh-keygen -t rsa -f id_rsa_ec2 -N ''
terraform apply
```

## manage access

```
export TF_VAR_my_home_ip="$(curl ifconfig.co)/32"
```

## ssh

```
ssh -i ./id_rsa_ec2 ubuntu@<public_ip>
```
