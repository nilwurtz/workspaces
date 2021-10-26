resource "aws_instance" "sample_ubuntu" {
  ami                    = data.aws_ami.ubuntu_20_04.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.test_subnet.id
  vpc_security_group_ids = [aws_security_group.test_sg.id]

  user_data = <<EOF
#!/bin/bash
apt update
apt install -y language-pack-ja-base language-pack-ja ibus-mozc
localectl set-locale LANG=ja_JP.UTF-8 LANGUAGE="ja_JP:ja"
source /etc/default/locale
EOF
}
