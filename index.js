const main = document.querySelector("main");
const buttonDiv = document.querySelector(".songButtons");
const myProgressBar = document.querySelector(".seek");
const shufflePath = document.querySelector(".shuffle path");
const nextPath = document.querySelector(".next path");
const previousPath = document.querySelector(".previous path");
const repeatPath = document.querySelector(".repeat path");
let i;
let defaultValue = false;

let renderDetailBar;
let convertSrcToObject;
let audio;
let shuffle = false;
shufflePath.setAttribute("fill", "#c0c0c1");
let repeat = false;

let next = false;
let player = false;
let audioQueue = [];
let currentPlaylist = [];
let recentlyPlayed = [];
let queue = [];
let queueOfImagegSrc = [];

audio = new Audio();

const playAndPause = function () {
  if (player) {
    console.log("player", player);
    document.querySelector(
      ".playBackground"
    ).innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24">
    <path class="svg_color" d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"></path>
  </svg>`;
  } else {
    console.log("player", player);
    document.querySelector(
      ".playBackground"
    ).innerHTML = `<svg width="13" height="14" viewBox="0 0 16 24">
    <path
      fill="#c0c0c1"
      class="svg_color"
      fill-rule="evenodd"
      d="M0 0v24l20-12z"
    ></path>
  </svg>`;
  }
};

playAndPause();

const renderHeading = function (heading, index) {
  main.innerHTML += `<section class="cards"></section>`;
  const cards = document.querySelectorAll(".cards")[index];
  cards.innerHTML += ` <h1 class="cards-heading">${heading}</h1>`;
  cards.innerHTML += `<div class="cards-container">`;
};

const renderCards = function (obj, index) {
  const cardsContainer = document.querySelectorAll(".cards-container")[index];
  cardsContainer.innerHTML += `<div class="cards-item">
  <img src=${obj.image_source} alt="hamsafar" />
  <p>${obj.song_name}</p>
  <div class="play-btn"></div>
</div>`;
};

fetch("https://github.com/akshatrajput009/gaanaClone/blob/main/ganna.json")
  .then((res) => res.json())
  .then((data) => {
    currentPlaylist = Object.values(data)[0];
    const cardBox = Object.values(data)[1];

    console.log(cardBox[2].songscards);
    let indexForHeading = 0;

    let indexForCards = 0;
    cardBox.forEach((el) => {
      const heading = el.songsbox;

      renderHeading(heading, indexForHeading);
      indexForHeading += 1;
      el.songscards.forEach((el) => {
        const songObj = el;

        renderCards(songObj, indexForCards);
      });
      indexForCards += 1;
    });

    return (renderCategory = function (category, source) {
      const playMusic = function () {
        i = 0;
        audio.addEventListener(
          "ended",
          function () {
            i = ++i < audioQueue.length ? i : 0;

            shuffle && (i = Math.ceil(Math.random() * audioQueue.length));

            repeat && (i = i - 1);

            renderDetailBar(convertSrcToObject(audioQueue[i]));

            fetchVideoAndPlay();
            function fetchVideoAndPlay() {
              fetch(audioQueue[i])
                .then((response) => {
                  console.log(response);
                  return response.url;
                })
                .then((url) => {
                  console.log(url);

                  audio.src = url;
                  audio.load();
                  return audio.play();
                })

                .catch((e) => {
                  console.error("error is", e);
                });
            }
          },
          true
        );

        audio.loop = false;
        audio.src = audioQueue[0];
        defaultValue && audio.play();
        defaultValue && (player = true);
      };
      const songsboxItem = cardBox.find((el) => {
        return el.songsbox === category;
      });

      queue = songsboxItem.songscards.map((el) => el.song_name);
      queueOfImagegSrc = songsboxItem.songscards.map((el) => el.quality.low);

      const songscardsItem = songsboxItem.songscards.find((el) => {
        return el.image_source === source;
      });

      convertSrcToObject = function (src) {
        return songsboxItem.songscards.find((el) => {
          return el.quality.low === src;
        });
      };

      renderDetailBar = function (songscardsItem) {
        document.querySelector(
          ".songDetails"
        ).innerHTML = `<img src="${songscardsItem.image_source}" alt="songPic" />
        <div class="songName">
          <a class="name" href="">${songscardsItem.song_name}</a>
          <a class="album" href="">${songscardsItem.album_name}</a>
          </div>`;
      };

      renderDetailBar(songscardsItem);

      const songSource = songscardsItem.quality.low;

      // queueOfImagegSrc = queueOfImagegSrc.filter((el) => el !== songSource);

      // queueOfImagegSrc.unshift(songSource);

      playSongIndex = queueOfImagegSrc.indexOf(songSource);

      let cutOut = queueOfImagegSrc.splice(playSongIndex);

      audioQueue = [...cutOut, ...queueOfImagegSrc];

      playMusic();
      playAndPause();

      // const checkPlaylist = currentPlaylist.find((el) => el === songSource);
      // if (!checkPlaylist) {
      //   currentPlaylist.unshift(songSource);
      //   recentlyPlayed.unshift(songscardsItem.song_name);
      //   playMusic();
      //   playAndPause();
      // } else {
      //   currentPlaylist = currentPlaylist.filter((el) => el !== checkPlaylist);
      //   currentPlaylist.unshift(songSource);
      //   recentlyPlayed = recentlyPlayed.filter(
      //     (el) => el !== songscardsItem.song_name
      //   );
      //   recentlyPlayed.unshift(songscardsItem.song_name);

      //   playMusic();
      //   playAndPause();
      // }

      // console.log(checkPlaylist);
      // console.log(currentPlaylist);
      // console.log(recentlyPlayed);
    });
  })
  .then((fn) => {
    fn("latest albums", "ASSETS/images/ppk2.jpg");
    const cards = document.querySelectorAll(".cards");

    Array.from(cards).forEach((el) =>
      el.addEventListener("click", function (ev) {
        defaultValue = true;
        console.log(
          "ev",
          ev.target.parentElement.parentElement.parentElement.childNodes,
          ev.target.parentElement.children[0].attributes.src.value
        );

        const category =
          ev.target.parentElement.parentElement.parentElement.childNodes ||
          ev.target.parentElement.parentElement.parentElement.parentElement
            .parentElement.childNodes;

        const imageSource =
          ev.target.parentElement.children[0].attributes.src.value ||
          ev.target.attributes.src.value;

        fn(category[1].innerHTML.toLowerCase(), imageSource);
      })
    );
  });

buttonDiv.addEventListener("click", function (ev) {
  console.log(ev.target.parentElement.classList[0]);
  if (
    ev.target.parentElement.parentElement.classList[0] === "play" ||
    ev.target.classList[0] === "playBackground" ||
    ev.target.parentElement.parentElement.classList[0] === "playBackground"
  ) {
    if (player) {
      audio.pause();
      player = false;
    } else {
      audio.play();
      player = true;
    }

    playAndPause();
  } else if (ev.target.parentElement.classList[0] === "shuffle") {
    if (!shuffle) {
      shufflePath.setAttribute("fill", "#e72c30");
      shuffle = true;
    } else {
      shufflePath.setAttribute("fill", "#c0c0c1");

      shuffle = false;
    }
  } else if (
    ev.target.parentElement.parentElement.parentElement.parentElement
      .classList[0] === "next" ||
    ev.target.parentElement.classList[0] === "next"
  ) {
    i = i < audioQueue.length - 1 ? i + 1 : 0;
    console.log(i);
    audio.pause();
    audio.currentTime = 0;
    shuffle && (i = Math.ceil(Math.random() * audioQueue.length));

    renderDetailBar(convertSrcToObject(audioQueue[i]));
    audio.src = audioQueue[i];
    audio.play();
    player = true;
    playAndPause();

    nextPath.setAttribute("fill", "#e72c30");

    setTimeout(() => {
      nextPath.setAttribute("fill", "#c0c0c1");
    }, 200);
  } else if (
    ev.target.parentElement.parentElement.parentElement.parentElement
      .classList[0] === "previous" ||
    ev.target.parentElement.classList[0] === "previous"
  ) {
    i = i > 0 ? i - 1 : audioQueue.length - 1;
    console.log(i);
    audio.pause();
    audio.currentTime = 0;
    shuffle && (i = Math.ceil(Math.random() * audioQueue.length));
    renderDetailBar(convertSrcToObject(audioQueue[i]));
    audio.src = audioQueue[i];
    audio.play();
    player = true;
    playAndPause();

    previousPath.setAttribute("fill", "#e72c30");

    setTimeout(() => {
      previousPath.setAttribute("fill", "#c0c0c1");
    }, 200);
  } else if (ev.target.parentElement.classList[0] === "repeat") {
    if (!repeat) {
      repeat = true;
      repeatPath.setAttribute("fill", "#e72c30");
    } else {
      repeat = false;
      repeatPath.setAttribute("fill", "#c0c0c1");
    }
  }
});

/* <button title="Pause" class="play playing">
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path class="svg_color" d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"></path>
  </svg>
</button>;

<button class="play">
  <div class="playBackground">
    <svg width="13" height="14" viewBox="0 0 16 24">
      <path
        fill="#c0c0c1"
        class="svg_color"
        fill-rule="evenodd"
        d="M0 0v24l20-12z"
      ></path>
    </svg>
  </div>
</button>; */

audio.addEventListener("timeupdate", () => {
  let progress = parseInt((audio.currentTime / audio.duration) * 100);

  myProgressBar.value = progress;
});

myProgressBar.addEventListener("change", (ev) => {
  audio.currentTime = audio.duration * (ev.target.value / 100);
});
