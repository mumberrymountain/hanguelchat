data "aws_iam_instance_profile" "ec2" {
  name = var.ec2_iam_role_name
}

resource "aws_instance" "main" {
  ami                    = var.ec2_ami
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = data.aws_iam_instance_profile.ec2.name

  depends_on = [aws_nat_gateway.main]

  user_data = file("${path.module}/scripts/ec2-init.sh")

  user_data_replace_on_change = true

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

