# Altar.io Multi-part File Upload Webserver

## Description
This project is a web server designed for multi-part file uploads, built using Express.js. It supports file uploads with basic authentication and includes features such as CPU and memory usage monitoring to prevent system overload.

## Installation
To set up the project for development:
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies with `npm install`.

## Usage
To start the server, run `npm start`. The server will listen on the configured port (default 3000).

Endpoints:
- `GET /`: Basic information about the service.
- `POST /upload`: Endpoint for uploading files. Requires basic authentication.
- `GET /status`: Returns the current CPU and memory usage, along with the current user count.

Example usage:
```bash
curl -i -u charlie:5647  -X POST -H "Content-Type: multipart/form-data" http://localhost:3000/upload --form file="@examples/people-2000000.csv"
```

## Running the in Docker
To run the server in a Docker container:
1. Build the Docker image with `docker build -t altar-io-webserver .`.
2. Run the Docker container with `docker run -p 3000:3000 altar-io-webserver`.
3. The server will be available at `http://localhost:3000`.
4. To stop the container, use `docker stop <container_id>`.
5. To remove the container, use `docker rm <container_id>`.
6. To remove the image, use `docker rmi altar-io-webserver`.
7. To run the container in detached mode, use `docker run -d -p 3000:3000 altar-io-webserver`.
8. To view the logs of the container, use `docker logs <container_id>`.
9. To view the running containers, use `docker ps`.

All files will be saved within the Docker image unless a volume is mounted. You could also extend the server to upload
files to a cloud storage service like AWS S3.

## Running the Tests
Execute the automated tests by running `npm test`.

## Running the Linter
Run the linter with `npm run lint`.

## Configuration
The server can be configured using the default configuration file `config/default.json`. The following options are available:
- `port`: The port the server will listen on.
- `maxMemoryUsage`: The maximum memory usage allowed for the server.
- `maxCpuUsage`: The maximum CPU usage allowed for the server.
- `maxConcurrentUsers`: The maximum number of concurrent users allowed for the server.

## What's Next
- Keep the user credentials in a database, using a more secure method than storing them. Passwords should be hashed and salted.
- Use a circuit breaker to prevent the server from being overwhelmed by too many requests.
- Create acceptance tests to ensure the server works as expected.
- Create a CI/CD pipeline to automate the testing and deployment process.