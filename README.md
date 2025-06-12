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
  - Slides use custom background images. Place image files in `public/backgrounds` with the following names so they load automatically:
    - `bull.jpg` - Top Touro
    - `cotton.jpg` - Guerra de Cotonete
    - `bingo.jpg` - Bingo
    - `beer.jpg` - Beer Pong
    - `pacal.jpg` - Pacal
    - `attractions.jpg` - Atrações
    - `score.jpg` - Placar
- Player names are shown in their team color (blue or yellow).
- The Admin panel lets you:
  - Register players and choose their team.
  - Record results for each activity.
  - Configure attraction times and team names.
  - Reset all data when needed.
  - Manage the attraction lineup through a simple editor.

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

Then access `http://localhost:3000/` for slides,
`http://localhost:3000/admin.html` for the admin menu,
`http://localhost:3000/players.html` to manage players,
`http://localhost:3000/teams.html` to edit team names,
`http://localhost:3000/bull.html` to register bull times,
`http://localhost:3000/cotton.html` for cotonete battles,
`http://localhost:3000/beer.html` for beer pong results,
`http://localhost:3000/pacal.html` for pacal duels,
`http://localhost:3000/bingo.html` to register bingo winners,
`http://localhost:3000/pontos.html` to configure scoring,
`http://localhost:3000/lineup.html` for the lineup editor,
`http://localhost:3000/reset.html` to reset all data.

### Data persistence

All scoreboard information is automatically saved to a `data.json` file in the
project root. The server loads this file on startup and writes changes back to
it whenever data is modified, so results persist across restarts. If the file
does not exist it will be created the first time the server runs.

### Background images

Add your desired slide backgrounds in the `public/backgrounds` directory using the filenames listed above. When present, they will automatically be used in the slideshow.

### Admin header image

To show a logo on the admin menu, place an image file named `admin-header.png` inside `public/images`. When present it will appear centered at the top of `admin.html`.
