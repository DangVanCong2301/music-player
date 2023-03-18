const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector("img"),
    musicName = wrapper.querySelector(".name"),
    musicArtist = wrapper.querySelector(".artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar")

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)
isMusicPause = true

window.addEventListener("load", () => {
    loadMusic(musicIndex)
})

const cdThumbAnimate = musicImg.animate(
    [{
        transform: "rotate(360deg)"
    }], {
    duration: 10000,
    iterations: Infinity
})
cdThumbAnimate.pause()

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name
    musicArtist.innerText = allMusic[indexNumb - 1].artist
    musicImg.src = `./assets/img/${allMusic[indexNumb - 1].img}.jpg`
    mainAudio.src = `./assets/audio/${allMusic[indexNumb - 1].src}.mp3`
}


function playMusic() {
    wrapper.classList.add("paused")
    // musicImg.classList.add("rotate")
    cdThumbAnimate.play()
    playPauseBtn.innerHTML = `<i class="uil uil-pause"></i>`
    mainAudio.play()
}

function pauseMusic() {
    wrapper.classList.remove("paused")
    // musicImg.classList.remove("rotate")
    cdThumbAnimate.pause()
    playPauseBtn.innerHTML = `<i class="uil uil-play"></i>`
    mainAudio.pause()
}

function prevMusic() {
    musicIndex--
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
}

function nextMusic() {
    musicIndex++
    musicIndex >  allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused")
    isMusicPlay ? pauseMusic() : playMusic()
})

prevBtn.addEventListener("click", () => {
    prevMusic()
})

nextBtn.addEventListener("click", () => {
    nextMusic()
})

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    let progressWidth = (currentTime / duration) * 100
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration")
    mainAudio.addEventListener("loadeddata", () => {
        let mainAdDuration = mainAudio.duration
        let totalMin = Math.floor(mainAdDuration / 60)
        let totalSec = Math.floor(mainAdDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    })
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth
    let clickOffsetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickOffsetX / progressWidth) * songDuration
    playMusic()
})

mainAudio.addEventListener("ended", () => {
    nextMusic()
})