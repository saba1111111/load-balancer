This project implements a custom load balancer using Node.js, designed to efficiently distribute incoming network traffic across multiple backend servers. The load balancer ensures high availability, scalability, and reliability by directing requests to healthy servers based on a weighted round-robin algorithm.

## Prerequisites

Before running the project, ensure you have the following installed: Docker, Docker Compose and OpenSSL.
You need to generate self-signed SSL/TLS certificates for the load balancer to handle HTTPS requests. Follow these steps:

1. Open a terminal and navigate to the `load-balancer` directory:

   ```sh
   cd load-balancer
   openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.cert -days 365 -nodes -subj "/C=US/ST=State/L=Locality/O=Organization/OU=Unit/CN=localhost"
   ```

2. "Create a .env file in the project directory by copying the content from .env.example."

3. Now, you can run the project using docker-compose up.
