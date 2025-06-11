# Arraia Do Lowis 3

This project provides a simple slide show and admin panel for a local party scoreboard.

## Usage

### Build Docker image

```bash
docker build -t arraia .
```

The provided Dockerfile uses the official `node:20` image as its base. You can swap in a different tag if you need another Node version.

### Run

```bash
docker run -p 3000:3000 arraia
```

Then access `http://localhost:3000/` for slides and `http://localhost:3000/admin.html` for admin panel.
