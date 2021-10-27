resource "aws_instance" "test_ubuntu" {
  ami                    = data.aws_ami.ubuntu_20_04.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.test_subnet.id
  vpc_security_group_ids = [aws_security_group.test_sg.id]
  key_name               = aws_key_pair.test_key.id

  tags = {
    Name = "test-ec2"
  }

  user_data = <<EOF
#!/bin/bash
apt update
apt install -y \
  language-pack-ja-base \
  language-pack-ja \
  ibus-mozc \
  ca-certificates \
  curl \
  gnupg \
  lsb-release
localectl set-locale LANG=ja_JP.UTF-8 LANGUAGE="ja_JP:ja"
source /etc/default/locale
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io
gpasswd -a ubuntu docker
EOF
}

resource "aws_key_pair" "test_key" {
  key_name   = "test-ec2-pubkey"
  public_key = file("./id_rsa_ec2.pub")
}
