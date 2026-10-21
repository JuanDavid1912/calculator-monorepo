# Full-Stack Calculator

This project is a full-stack calculator application organized as a monorepo. The frontend is built with **React**, **TypeScript**, and **Vite**. The backend is a REST API built in **Go 1.27** using the standard library. Both environments are containerized into a single lightweight Docker image.

---

## Setup Instructions

To run the application via Docker, you only need **Docker** installed on your system.

To run the application locally for development, you will need:

- **Go 1.27** or higher
- **Node.js** (v22 recommended) and `pnpm`

---

## How to Run

### Option 1: Using Docker (Recommended for Production)

The application uses a multi-stage Dockerfile that builds both the Go backend and the React frontend, serving them together in a single Alpine container.

1. **Build the image:**

   ```bash
   docker build -t fullstack-calculator .
   ```

2. **Run the container:**

   ```bash
   docker run -p 80:80 -p 8080:8080 fullstack-calculator
   ```

3. Open [http://localhost](http://localhost) in your browser. The backend API will be available internally on port `8080`.

### Option 2: Local Development

#### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Download dependencies:

   ```bash
   go mod download
   ```

3. Start the Go server:

   ```bash
   go run main.go
   ```

   The backend will start on port `8080`.

#### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the Vite development server:

   ```bash
   pnpm run dev
   ```

---

## 🔌 API Reference

The Go backend exposes a single REST endpoint for mathematical operations.

- **Endpoint:** `POST /api/calculate`
- **Headers:** `Content-Type: application/json`
- **Valid operations:** `add`, `subtract`, `multiply`, `divide`, `power`, `square_root`, `percent`

### Example Request (Multiplication)

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 5, "b": 3, "operation": "multiply"}'
```

### Example Response (Success)

```json
{
  "result": 15
}
```

### Example Response (Error: Division by Zero)

```json
{
  "error": "division by zero"
}
```

### Example Request (Square Root)

> **Note:** For `square_root`, the `b` parameter is ignored by the backend.

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 16, "b": 0, "operation": "square_root"}'
```

---

## Design Decisions & Assumptions

- **Single Endpoint for All Operations:** Instead of creating one endpoint per operation, the API exposes a single `POST` `/api/calculate` endpoint. Every calculation, no matter the operation, requires the same input: two numbers (`a` and `b`) plus an `operation` field. Keeping one endpoint makes the API contract uniform and the backend easier to maintain: changing how a calculation works, or adding a new operation in the future, only requires updating the calculation logic in the backend, with no new routes to create or document. Operations that need fewer operands (such as `square_root`) simply ignore `b`.

- **Go Backend Structure:** Built using a Model-Service-Controller (MSC) pattern to separate business logic from HTTP routing. It uses the native `net/http` package without external web frameworks to keep the binary lightweight and performant. Custom error handling is implemented for edge cases like division by zero and negative square roots.

- **CORS Handling:** The backend `CalculatorController` explicitly handles `OPTIONS` HTTP requests to resolve browser preflight CORS restrictions when the React frontend communicates with the API.

- **React/Vite Frontend:** Bootstrapped with Vite for fast Hot Module Replacement (HMR) and optimized builds. The UI uses a CSS grid layout for the keypad and manages asynchronous `fetch` operations to interact with the Go API.

- **Unified Containerization:** A multi-stage Dockerfile is used. It compiles the Go binary using `golang:alpine` and the React static files using `node:22-alpine`. The final production stage uses a bare `alpine:latest` image, leveraging `busybox-extras` to run a lightweight `httpd` static server on port `80` while executing the Go binary concurrently on port `8080`.

- **Testing Strategy:** Quality is enforced across the stack. The backend employs Go's standard library testing for business logic, while the frontend leverages modern tooling (Vitest, React Testing Library, happy-dom) for isolated UI and interaction testing without requiring a live backend. 
  - To run backend tests: `cd backend && go test ./... -v`
  - To run frontend tests: `cd frontend && pnpm run test`