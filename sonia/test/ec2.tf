resource "aws_instance" "sample_ubuntu" {
  ami                    = "ami-036d0684fc96830ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.test_subnet.id
  vpc_security_group_ids = [aws_security_group.test_sg.id]
}
