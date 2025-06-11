# Arraia Do Lowis 3

This project provides a simple slide show and admin panel for a local party scoreboard.

## Features

- Rotating slideshow where each slide stays on screen for **5 seconds**.
- Seven different slides show the event information:
  1. **Top 6 bull riding times** with the points awarded and a trophy on the first place.
  2. **Cotonete battles** history displaying the winner with a trophy.
  3. **Bingo** first, second and third place (only appears when data is entered).
  4. **Beer Pong** battle history with two players on each side and the winner.
  5. **Pacal** battle history.
  6. **Current and next attraction** based on the schedule, including a countdown.
  7. **Overall team score** using a horizontal bar chart with the winning team on top and a trophy.
- Every slide has a custom background color.
- Player names are shown in their team color (blue or yellow).
- The Admin panel lets you:
  - Register players and choose their team.
  - Record results for each activity.
  - Configure attraction times and team names.
  - Reset all data when needed.

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

Then access `http://localhost:3000/` for slides, `http://localhost:3000/admin.html` for the admin panel and `http://localhost:3000/pontos.html` to configure scoring.
