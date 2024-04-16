let currentSong=new Audio();
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/assets/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondsToMS(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60); // Round down to the nearest integer
  
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  
    return formattedMinutes + ":" + formattedSeconds;
}
const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/assets/songs/" +track +".mp3");
    currentSong.src=("/assets/songs/" +track +".mp3");
    if(!pause){
        currentSong.play();
        play.src="pause.svg";
    }
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function main() {
    //get list of songs
    let songs = await getSongs();
    playMusic(songs[0],true);

    //console.log(songs);

    //show all songs
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
            <img src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
            </div>
            <div class="playnow">
                <img src="play.svg" alt="">
            </div> </li>`;
    }

    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    //attach an event listner to play,previous , next
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg"
        }
        else{
            currentSong.pause();
            play.src="play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        //console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMS(currentSong.currentTime)}/${secondsToMS(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //adding event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime=(currentSong.duration*percent)/100;
    })
}

main();