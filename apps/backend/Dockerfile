# Start from the official Go image for building
FROM golang:1.24 AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o main .

# Use a minimal image for running
FROM alpine:latest

WORKDIR /app

# Install libc (required by Go binaries)
RUN apk add --no-cache libc6-compat

# Copy the built binary from builder
COPY --from=builder /app/main .

# Set permissions (optional but recommended)
RUN chmod +x ./main

# Run the binary
CMD ["./main"]