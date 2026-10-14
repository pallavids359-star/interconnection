/* =========================================================
   EDIT EVERYTHING HERE  ✎
   - Replace names, dates and words with your real story.
   - For photos: put a link to an image in "photo" (e.g. "img/first-date.jpg").
     Leave it "" to use the soft color background instead.
   - For videos: put the video file in "video" (e.g. "videos/first-date.mp4").
     Use .mp4 files placed in a "videos" folder next to this page.
     Tapping that episode then plays the video. Leave "" for no video.
   - Music: every episode has its own built-in tune. To use your own song instead,
     put an .mp3 next to this page and set "music" (e.g. "music/our-song.mp3").
   ========================================================= */
// Pictures used in the films (keep these files in the assets folder)
const ASSETS={girl:"assets/girl.webp",boy:"assets/boy.webp",scene:"assets/scene.jpg"};

const CONFIG = {
  his: "Prateek",          // boyfriend's name
  her: "Pallavi",          // her name
  startYear: "2024",       // the year your story began
  startDate: "2024-06-23", // the exact day you got together (YYYY-MM-DD), for the live "Together for" counter
  heroPhoto: ASSETS.scene, // big background picture (the couple illustration)
  heroDesc: "A girl, a boy and a love story nobody could have written better. Critics call it heartwarming. She calls it the best thing that ever happened to her.",

  episodes: [
    // "film" = the built-in animated short film for that episode.
    // If you also fill "video", your real video plays instead of the film.
    {title:"The Man He Is", date:"His character", film:"character", photo:"", video:"", music:"",
     text:"Kind, honest, patient, and the safest person I know. You make everyone around you better, and you make me better.",
     quote:"The world needs more people like you. Lucky me, I got you."},
    {title:"That Smile", date:"His smile", film:"smile", photo:"", video:"", music:"",
     text:"There's no bad day your smile can't fix. I'd do anything just to see it one more time.",
     quote:"Please never stop smiling."},
    {title:"Officially Too Cute", date:"His cuteness", film:"cute", photo:"", video:"", music:"",
     text:"Sleepy you, angry you, silly you. Every version of you is my favourite.",
     quote:"Cuteness level: off the charts."},
    {title:"Miles Apart", date:"Long distance", film:"distance", photo:"", video:"", music:"",
     text:"Missed calls, late-night video chats, counting days. Being far from you was the hardest thing I've done. Loving you was the easiest.",
     quote:"Every kilometre was worth it."},
    {title:"The Question", date:"The proposal", film:"proposal", photo:"", video:"", music:"",
     text:"This time, I'm the one asking. Watch till the end and give me your answer.",
     quote:"Choose carefully. (There's only one right answer.)"},
    {title:"Make A Wish", date:"Cake time", film:"cake", photo:"", video:"", music:"",
     text:"Make a wish, blow out the candles, and cut the cake with me. Blow into your mic, or tap the candles.",
     quote:"I hope all your wishes come true. Mine already did."}
  ],

  distanceKm: 300,                          // Episode 4: how far apart you were
  candles: 5,                               // Episode 6: number of candles
  cakeTitle: "Happy Birthday, {his}!",      // Episode 6: text after the cake is cut

  reasons: [
    "The way you look at me",
    "Your laugh",
    "How you make me feel safe",
    "You never let me sleep angry",
    "Your terrible jokes",
    "How hard you work",
    "Your hugs fix everything",
    "You believe in me",
    "You are my best friend",
    "You're simply you"
  ],

  soon: [
    {title:"More Late Night Talks", text:"Hours of them. I'll never get tired of your voice."},
    {title:"Travelling The World", text:"Every place I've dreamed of, I want to see with you."},
    {title:"Growing Old Together", text:"Grey hair, slow walks, still holding hands."}
  ],

  openWhen: [   // "Open when..." letters
    {when:"you miss me", letter:"Hey, my love.\nIf you're reading this, you're missing me. And I promise, wherever I am right now, I'm missing you too.\nPut your hand on your heart. Feel that? That's where I live.\n300 kilometres can keep us apart, but they can never keep us away."},
    {when:"you can't sleep", letter:"Count my kisses instead of sheep.\nOne on your forehead, one on each cheek, one on your nose...\nI'll keep going until you fall asleep. Goodnight, my love."},
    {when:"you've had a bad day", letter:"Hey you. Whatever happened today doesn't change how proud I am of you.\nBreathe. Tomorrow is new, and I'm always on your team."},
    {when:"you doubt yourself", letter:"Read this slowly:\nYou are kind. You are smart. You are enough.\nI believe in you more than anything in this world."},
    {when:"you need a laugh", letter:"Remember your terrible jokes? I laugh every single time.\nNot because they're funny. Because you are adorable when you tell them."},
    {when:"you want to know how much I love you", letter:"More than yesterday.\nLess than tomorrow.\nForever and always, {his}."}
  ],

  credits: [    // end credits after the final letter: [small heading, big line]
    ["Forever presents",""],
    ["","{his} & {her}"],
    ["Starring","{his}\nas The Love of My Life"],
    ["and","{her}\nas The Luckiest Girl in the World"],
    ["Directed by","Destiny"],
    ["Written by","Every little moment we shared"],
    ["Music by","Our heartbeats"],
    ["Filmed on location","Wherever we are together"],
    ["Catering","All our late-night food dates"],
    ["Special thanks","The day we met"],
    ["","No hearts were broken in the making of this series."],
    ["Season 2","Coming soon. Starring us, again."]
  ],

  finale: [
    "My dearest {his},",
    "I made this because a normal card was too small for everything I feel.",
    "You are my favourite person, my safest place, my home.",
    "Thank you for loving me the way you do.",
    "Out of every story in the world, ours is my favourite.",
    "And this is only Season 1.",
    "BIG:I love you",
    "SIG:Forever yours, {her}"
  ]
};
