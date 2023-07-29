## Connect to EC2 instance
ssh -i -----PEM FILE PATH---- -----INSTANCE URL------

## Command to forward all incoming traffic of Port 80 to Port 8080
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
