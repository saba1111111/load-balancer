This project implements a custom load balancer using Node.js, designed to efficiently distribute incoming network traffic across multiple backend servers. The load balancer ensures high availability, scalability, and reliability by directing requests to healthy servers based on a weighted round-robin algorithm.

## Prerequisites

Before running the project, ensure you have the following installed: Docker, Docker Compose and OpenSSL.
You need to generate self-signed SSL/TLS certificates for the load balancer to handle HTTPS requests. Follow these steps:

1. Open a terminal and navigate to the `load-balancer` directory:

   ```sh
   cd load-balancer
   openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.cert -days 365 -nodes -subj "/C=US/ST=State/L=Locality/O=Organization/OU=Unit/CN=localhost"
   ```

2. Create a .env file in the project directory by copying the content from .env.example.

3. Now, you can run the project using docker-compose up.

## Technical part of the project.

- **HTTPS SSL Communication**:
  - Secures communication between the load balancer server and clients using SSL/TLS certificates.
- **HTTP Keep-Alive**:
  - Optimizes server communication performance by keeping connections open, reducing the overhead of establishing new connections for each request.
- **Weighted Round Robin Load Balancing**:
  - Distributes requests based on server capacity (weight), Servers with higher weights receive a proportionally higher number of requests, Ensures efficient utilization of server resources.
- **Health Monitoring**:
  - Periodically checks the health status of backend servers, Only routes traffic to servers that are confirmed to be healthy.
- **Node.js Cluster Module**:
  - Uses the Node.js cluster module to run several instances of the load balancer server, enhancing performance by leveraging multi-core processing capabilities.
- **Centralized Memory Store with Redis**:
  - Utilizes Redis as a centralized memory store, ensuring consistent state management across multiple instances of the load balancer.
- **Docker Compose**:
  - Uses Docker Compose to run Redis, the load balancer, and multiple instances of test servers, simplifying the deployment and management of the entire environment.

## Project Structure

```
load-balancer/
   /src
      /configurations    # Contains configurations, including the centralized memory store configuration for Redis.
      /constants         # Contains constants and static data for the project.
      /helpers           # Contains helper functions.
      /interfaces        # Includes interfaces for data description and abstractions for dependencies.
      /services
           |--load-balancer-state/    # Contains business logic for managing the load balancer algorithm state.
           |--manage-servers/         # Contains business logic for managing, keeping only health servers in the centralized store.
           |--handle-requests/        # Contains logic for redirecting incoming request to avaliable servers.

   /certs   #  SSL public and private keys.

server/     # Test server, which is run in 3 different copies via Docker Compose.

```
