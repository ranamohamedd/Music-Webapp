const wrapper = document.querySelector(".wapper"),
musicImg =wrapper.querySelector(".img-area img"),
musicName= wrapper.querySelector(".song-details .name"),
musicArtist= wrapper.querySelector(".song-details .artist"),
mainAudio= wrapper.querySelector("#main-audio"),
playPauseBtn=wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea =wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList= wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more_music"),
hideMusicBtn = musicList.querySelector("#close");



let musicIndex=1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb){
    musicName.innerHTML=allMusic[indexNumb-1].name;
    musicArtist.innerHTML=allMusic[indexNumb-1].artist;
    musicImg.src ='images/'+ allMusic[indexNumb-1].img;
    mainAudio.src= 'songs/'+ allMusic[indexNumb-1].src+'.mp3';

} 
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerHTML="pause";
    mainAudio.play();
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerHTML="play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused=wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});

nextBtn.addEventListener("click",()=>{
    nextMusic();
});

prevBtn.addEventListener("click",()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = progressWidth+'%';

    let musicCurrentTime = wrapper.querySelector(".current");
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = '0'+totalSec;
        }
        musicDuration.innerHTML = totalMin + ':' + totalSec;


    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = '0'+currentSec;
    }
    musicCurrentTime.innerHTML = currentMin + ':' + currentSec;


});

progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX=e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX/progressWidthval)*songDuration;
    playMusic(); // if the user click on the progress bar when the music is paused

});

// For repeat
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerHTML;

    switch(getText){
        case "repeat":
            repeatBtn.innerHTML="repeat_one";
            repeatBtn.setAttribute("title","Song looped")    
            break;
        
        case "repeat_one":
            repeatBtn.innerHTML="shuffle";
            repeatBtn.setAttribute("title","Playback shuffle")
            break;

        case "shuffle":
            repeatBtn.innerHTML="repeat";
            repeatBtn.setAttribute("title","Playlist looped")            
            break;
    }

});

mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerHTML;

    switch(getText){
        case "repeat":
            nextMusic();   
            break;
        
        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;

        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic(); 
            playingNow();              
            break;
    }


});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");

});
hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();

});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = '0'+totalSec;
        }
        liAudioDuration.innerHTML = totalMin + ':' + totalSec;
        liAudioDuration.setAttribute("t-duration" , `${totalMin}:${totalSec}`);


    });
     
}
const allLiTages = ulTag.querySelectorAll("li");
function playingNow(){

    for (let j = 0; j < allLiTages.length; j++) {
        let audioTag = allLiTages[j].querySelector(".audio-duration");
        if(allLiTages[j].classList.contains("playing")){
            allLiTages[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerHTML=adDuration;
            
        }

        if(allLiTages[j].getAttribute("li-index") == musicIndex){
            allLiTages[j].classList.add("playing");
            audioTag.innerHTML="Playing";
        }
    
        allLiTages[j].setAttribute("onclick","clicked(this)");
            
    }
    
}

function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}


