const wrapper = document.querySelector(".wrapper")
musicImg = wrapper.querySelector(".img-area img")
musicName = wrapper.querySelector(".song-details .name")
musicArtist = wrapper.querySelector(".song-details .artist")
mainAudio = wrapper.querySelector("#main-audio")
playPauseBtn = wrapper.querySelector(".play-pause")
prevBtn = wrapper.querySelector("#prev")
nextBtn = wrapper.querySelector("#next")
progressBar = wrapper.querySelector(".progress-bar")
progressArea = wrapper.querySelector(".progress-area")
showMoreBtn = wrapper.querySelector("#more-music")
musicList = wrapper.querySelector(".music-list")
hideMusicBtn = musicList.querySelector("#close")

let musicIndex =  Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex)
    playingNow()
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name
    musicArtist.innerText = allMusic[indexNumb - 1].artist
    musicImg.src = `./assets/img/${allMusic[indexNumb - 1].img}.jpg`
    mainAudio.src = `./assets/audio/${allMusic[indexNumb - 1].src}.mp3`
}

function playMusic() {
    wrapper.classList.add("paused")
    playPauseBtn.classList.add("paused")
    mainAudio.play()
}

function pauseMusic() {
    wrapper.classList.remove("paused")
    playPauseBtn.classList.remove("paused")
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++
    // if music index is greater than array length then musicIndex win be 1 so the first song will play 
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

function prevMusic() {
    // here we 'll just decrement of index by 1
    musicIndex--
    // if musicIndex is less than 1 then musicIndex will
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused")
    isMusicPaused ? pauseMusic() : playMusic()
})

nextBtn.addEventListener("click", () => {
    nextMusic();
})

prevBtn.addEventListener("click", () => {
    prevMusic();
})

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    let progressWith = (currentTime / duration) * 100
    progressBar.style.width = `${progressWith}%`

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration")
    mainAudio.addEventListener("loadeddata", () => {

        // upatate song total duration
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`

    })

    // update playing song current time
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

// lets update playing song current time according to the progress bar with
progressArea.addEventListener("click", (e) => {
    let progressBarWithval = progressArea.clientWidth;
    let clickedOfSetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickedOfSetX / progressBarWithval) * songDuration
    playMusic()
})

// let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText
    // let's do diffirent changes on diffirent icon click using swith
    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title", "Song looped")
            break
        case "repeat_one":
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title", "Playback shuffle")
            break
        case "shuffle":
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist looped")
            break
    }
})

mainAudio.addEventListener("ended", () => {
    // we'll do accoarding to the icon means if user then change it to repeat 
    let getText = repeatBtn.innerText
    switch(getText) {
        case "repeat":
            nextMusic();
            break
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex)
            playMusic();
            break
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            } while (musicIndex == randIndex)
            musicIndex = randIndex
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break
    }

})

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show")
})

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click()
})

const ulTag = wrapper.querySelector("ul")

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio src="./assets/audio/${allMusic[i].src}.mp3" class="${allMusic[i].src}"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`
    ulTag.insertAdjacentHTML("beforeend", liTag)

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener("loadeddata", () => {
        // upatate song total duration
        let audioDuration = liAudioTag.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`)
    })
}

const allLiTags = ulTag.querySelectorAll("li")

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing")
            let addDuration = audioTag.getAttribute("t-duration")
            audioTag.innerText = addDuration
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing")
            audioTag.innerText = "Playing"
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
    
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index")
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

