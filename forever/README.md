# FOREVER ♥ Prateek & Pallavi

A surprise website in the style of a streaming app: one show, six episodes, made for Prateek by Pallavi.

## What's inside

| Part | What it does |
|---|---|
| Who's watching? | Profile screen. Only Prateek's profile opens the show. |
| Intro | Animated F♥REVER logo with a "ta-dum" sound. |
| Banner | Their illustration, the show title, Play and More info. |
| Together for | Live counter since 23 June 2024 (days, hours, minutes, seconds). |
| Season 1 | Six animated short films with their own music and player controls. |
| Open When... | Six envelopes, each with a handwritten-style letter. |
| Top 10 / Coming Soon | Reasons she loves him, and their future plans. |
| Final Episode | Love letter, end credits, and a "Did you enjoy Season 1?" rating. |

### Episodes

1. **The Man He Is**: profile card, journal of little things, "he chose me".
2. **That Smile**: split close-up, polaroids, sunset.
3. **Officially Too Cute**: warning screen, photo booth, cuteness scanner, "Officially mine" stamp.
4. **Miles Apart**: 300 km long distance, night turns to dawn when they reunite.
5. **The Question**: she proposes; the "No" button runs away.
6. **Make A Wish**: blow out the candles (microphone or tap) and cut the cake.

## Folder structure

```
forever/
├── index.html        Page structure
├── css/style.css     All styling
├── js/config.js      ✎ EDIT HERE: names, dates, letters, text
├── js/app.js         Films, music, player, effects (no need to edit)
├── assets/
│   ├── boy.webp      Prateek (cut out from the illustration)
│   ├── girl.webp     Pallavi (cut out from the illustration)
│   └── scene.jpg     The full beach illustration
└── README.md
```

## How to edit

Open `js/config.js` in any text editor. Everything is in plain words:

- `his`, `her`: names
- `startDate`: the day you got together (`YYYY-MM-DD`)
- `distanceKm`: Episode 4 distance
- `cakeTitle`: text shown after the cake is cut
- `episodes`: title, text and quote for each episode
- `openWhen`: the "Open when..." letters (`\n` starts a new line)
- `reasons`, `soon`, `finale`, `credits`: the other rows and the final letter

Optional:
- **Your own song** for an episode: put an `.mp3` in a `music/` folder and set `music: "music/our-song.mp3"`.
- **A real video** for an episode: put an `.mp4` in a `videos/` folder and set `video: "videos/clip.mp4"`.

## Deploy

### Option A: GitHub Pages
1. Upload **everything inside** the `forever` folder to the repository root
   (GitHub → **Add file → Upload files**, drag all files and folders, **Commit changes**).
   `index.html` must be at the top level of the repo, not inside a sub-folder.
2. **Settings → Pages → Build and deployment**:
   Source **Deploy from a branch**, Branch **main**, Folder **/ (root)**, **Save**.
3. After about a minute the site is live at
   `https://<username>.github.io/<repository>/`

### Option B: Netlify Drop
1. Go to **app.netlify.com/drop** and drag the whole `forever` folder in.
2. Sign up (free) so the site doesn't expire.
3. **Site configuration → Change site name** → for example `prateek-pallavi` → `prateek-pallavi.netlify.app`.

## Before sending the link

- Test it on a phone: intro, two episodes, a letter, the final episode and credits.
- Phones only play sound after a tap, and iPhones mute websites when the silent switch is on.
- The cake's microphone button works on the hosted (https) link; the phone asks for mic permission once.
- A public GitHub repo means anyone can read the letters in the code. Use Netlify, or keep the repo private, if that matters.
