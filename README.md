# Load Balancer Project

This project sets up a load balancer with HTTPS support to distribute requests to multiple backend servers.

## Prerequisites

Before running the project, ensure you have the following installed:

- Docker
- Docker Compose
- OpenSSL

You need to generate self-signed SSL/TLS certificates for the load balancer to handle HTTPS requests. Follow these steps:

1. Open a terminal and navigate to the `load-balancer` directory:

   ```sh
   cd load-balancer
   ```

   openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.cert -days 365 -nodes -subj "/C=US/ST=State/L=Locality/O=Organization/OU=Unit/CN=localhost"
