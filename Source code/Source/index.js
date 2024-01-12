const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const musicList = $(".music-list");
const track = $("audio");
const thumbName = $(".music-thumb-name");
const thumbSinger = $(".music-thumb-singer");
const musicImg = $(".music-img");
const playBtn = $("#toggle");
const shuffleBtn = $("#shuffle");
const nextBtn = $("#turn-up");
const prevBtn = $("#turn-back");
const timeDuration = $(".time-duration");
const timeRemaining = $(".time-remaining");
const progressBar = $("#music-range");
const shuffleIcon = $("#shuffle-icon");
const repeatBtn = $("#repeat");
const repeatIcon = $("#repeat-icon")
let currentSong = 0;
const app = {
    // debounce function
    debounce: function(func, wait, immediate){
        var timeout;
	    return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
    },
    data: [
        {
            musicName: "Drowning",
            author: "Backstreet Boys",
            musicUrl: "/Source code/Music/drowning.mp3",
            img: "/Source code/IMG/Drowning.jpg"
        },
        {
            musicName: "Every Summetime",
            author: "Niki",
            musicUrl: "/Source code/Music/everysummertime.mp3",
            img: "/Source code/IMG/everysummertime.jpg"
        },
        {
            musicName: "One Call Away",
            author: "Charlie Puth",
            musicUrl: "/Source code/Music/onecallaway.mp3",
            img: "/Source code/IMG/onecallaway.jpg"
        },
        {
            musicName: "Only",
            author: "Lee Hi",
            musicUrl: "/Source code/Music/only.mp3",
            img: "/Source code/IMG/only.jpg"
        },
        {
            musicName: "Shape Of My Heart",
            author: "Backstreet boys",
            musicUrl: "/Source code/Music/shapeofmyheart.mp3",
            img: "/Source code/IMG/shapeofmyheart.jpg"
        },
        {
            musicName: "Gimme! gimme! gimme",
            author: "ABBA",
            musicUrl: "/Source code/Music/gimme.mp3",
            img: "/Source code/IMG/gimme.jpg"
        }, 
        {
            musicName: "Lay All Your Love On Me",
            author: "ABBA",
            musicUrl: "/Source code/Music/layallyourloveonme.mp3",
            img: "/Source code/IMG/layall.jpg"
        },
        {
            musicName: "I Want It That Way",
            author: "Backstreet boys",
            musicUrl: "/Source code/Music/iwantitthatway.mp3",
            img: "/Source code/IMG/iwantit.jpg"
        }
    ],
    render: function(){
        const dataRender = this.data.map((dataItem, i) => {
            return(
            `<li class="music-item" index="${i}">
                <img src="${dataItem.img}" alt="">
                <div class="music-name">
                    <p>${dataItem.musicName}</p>
                </div>
                <div class="author-name">
                    <p>${dataItem.author}</p>
                </div>
            </li>`
            )
        });
        musicList.innerHTML = dataRender.join('')
    },
    handleToggle: function(){
        playBtn.addEventListener('click', function(){
            if(playBtn.classList.contains('on')){
                app.pause();
            } else {
                app.playing();
            }
        });
    },
    playing: function(){
        playBtn.classList.add('on')
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        track.play();
        app.timeCount();
    },
    pause: function(){
        playBtn.classList.remove('on')
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        track.pause(); 
    },
    loading: function(i){
        track.src = this.data[i].musicUrl;
        thumbName.innerText = this.data[i].musicName;
        thumbSinger.innerText = this.data[i].author;
        musicImg.setAttribute("src", this.data[i].img)
    },
    itemClick: function(){
        let musicItems = $$(".music-item");
        musicItems.forEach((musicItem) => {
            musicItem.addEventListener("click", function(){
                currentSong = musicItem.getAttribute("index");
                app.loading(currentSong);
                app.playing();
                
            });
        });
    },
    nextSong: function(){
        nextBtn.addEventListener('click', function(){
            if(currentSong >= app.data.length - 1 ){
                currentSong = 0;
            } else {
                currentSong +=1;
            }
            app.loading(currentSong);
            app.playing();
        });  
    },
    prevSong: function(){
        prevBtn.addEventListener('click', function(){
            if(currentSong < 1){
                currentSong = app.data.length - 1;
            } else {
                currentSong -=1;
            }
            app.loading(currentSong);
            app.playing();
        })
    },
    timeCount: function(){
        track.addEventListener('timeupdate', function(){
            //progress bar
            let currentMin = Math.floor(track.currentTime/60);
            let currentSecond = Math.floor(track.currentTime%60);
            if(currentSecond < 10){
                timeDuration.innerHTML = `${currentMin}:0${currentSecond}`;
            } else {
                timeDuration.innerHTML = `${currentMin}:${currentSecond}`;
            };
            track.addEventListener('loadeddata', function(){
                let totalMin = Math.floor(track.duration/60);
                let totalSecond = Math.floor(track.duration%60);
                if(totalSecond < 10){
                    timeRemaining.innerHTML = `${totalMin}:0${totalSecond}`
                } else {
                    timeRemaining.innerHTML = `${totalMin}:${totalSecond}`
                };
            });
            
        });
    },
    handleProgressBar: function(){
        let disableTimeupdate = false;

        track.addEventListener('timeupdate', function() {
            if (disableTimeupdate) return;
            progressBar.max = track.duration;
            progressBar.value = track.currentTime;
        })
        let debounceEnableTimeupdate = app.debounce(function() { 
            disableTimeupdate = false; 
        }, 1000);
        progressBar.addEventListener('input', function() {
            disableTimeupdate = true;
            debounceEnableTimeupdate();
            track.currentTime = progressBar.value;
        })
    },
    pressKey: function(){
        window.addEventListener('keyup', function(e){
            if (e.key == " " || e.code == "Space") 
            {
                if(playBtn.classList.contains('on')){
                    app.pause();
                } else {
                    app.playing();
                }
            } else if (e.code == "ArrowLeft"){
                if(currentSong < 1){
                    currentSong = app.data.length - 1;
                } else {
                    currentSong -=1;
                }
                app.loading(currentSong);
                app.playing();
            } else if(e.code == "ArrowRight"){
                if(currentSong >= app.data.length - 1 ){
                    currentSong = 0;
                } else {
                    currentSong +=1;
                }
                app.loading(currentSong);
                app.playing();
            }
        });
    },
    musicLoop: {
        shuffleLoop: function(){
            shuffleBtn.addEventListener('click', function(){
                if(shuffleBtn.classList.contains('shuffleOn')){
                    shuffleBtn.classList.remove('shuffleOn')
                    shuffleIcon.style.color = 'rgb(48, 48, 48)'
    
                } else{
                    shuffleBtn.classList.add('shuffleOn')
                    repeatBtn.classList.remove('repeatOn')
                    repeatIcon.style.color = 'rgb(48, 48, 48)';
                    shuffleIcon.style.color = '#e181d1';
                };
            });
        },
        handleShuffle: function(){
            let prevSong = currentSong;
            function checkRepeatSong(){
                let max = app.data.length;
                let nextSong =  Math.floor(Math.random()*(max))
                if(nextSong == prevSong){
                    nextSong = checkRepeatSong();
                } 
                return nextSong;
                
            }
            currentSong = checkRepeatSong()
            app.loading(currentSong);
            app.playing();
        },
        musicOrderLoop: function(){
            if(currentSong >= app.data.length - 1 ){
                currentSong = 0;
            } else {
                currentSong +=1;
            }
            app.loading(currentSong);
            app.playing();
        },
        repeatLoop: function(){
            repeatBtn.addEventListener('click', function(){
                if(repeatBtn.classList.contains('repeatOn')){
                    repeatBtn.classList.remove('repeatOn')
                    repeatIcon.style.color = 'rgb(48, 48, 48)'
                    
                } else{
                    repeatBtn.classList.add('repeatOn')
                    repeatIcon.style.color = '#e181d1';
                    shuffleBtn.classList.remove('shuffleOn')
                    shuffleIcon.style.color = 'rgb(48, 48, 48)'
                };
            });
        },
        handleRepeat: function(){
                app.loading(currentSong);
                app.playing();
        }
    },
    handleLoop: function(){
        track.addEventListener('ended', function(){
            if(shuffleBtn.classList.contains('shuffleOn')){
                app.musicLoop.handleShuffle();
           } else if(repeatBtn.classList.contains('repeatOn')){
                shuffleBtn.classList.remove('shuffleOn')
                app.musicLoop.handleRepeat();
           } else {
                app.musicLoop.musicOrderLoop();
           }
        })
    },
    handle: function(){
        app.render(); 
        app.itemClick();
        app.handleToggle();
        app.nextSong();
        app.prevSong();
        app.handleProgressBar();
        app.timeCount();
        app.pressKey();
        app.musicLoop.shuffleLoop();
        app.musicLoop.repeatLoop();
        app.handleLoop();
    }
    
    
};
app.handle()
