
/*
1.render songs
2.cd quay
3.play/stop
4.next/prev
5.random
6.replay
7.run time
8.activiti song
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    randomIndex: [],
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'EDM TikTok Hay 2022',
            singer: 'TTKyen',
            path: './assets/songs/song_1.mp3',
            image: './assets/images/imgsong_1.jpg'
        },
        {
            name: 'Người Chơi Hệ Đẹp',
            singer: '16 Typh',
            path: './assets/songs/song_2.mp3',
            image: './assets/images/imgsong_2.jpg'
        },
        {
            name: 'Trên Tình Bạn Dưới Tình Yêu',
            singer: '16 Typh, MIN',
            path: './assets/songs/song_3.mp3',
            image: './assets/images/imgsong_3.jpg'
        },
        {
            name: 'Walk On Da Street',
            singer: '16 Typh',
            path: './assets/songs/song_4.mp3',
            image: './assets/images/imgsong_4.jpg'
        },
        {
            name: 'Quan Hệ Rộng',
            singer: 'Bình Gold',
            path: './assets/songs/song_5.mp3',
            image: './assets/images/imgsong_5.jpg'
        },
        {
            name: 'Con Gái Rượu',
            singer: 'B Ray',
            path: './assets/songs/song_6.mp3',
            image: './assets/images/imgsong_6.jpg'
        },
        {
            name: 'Cao Ốc 20',
            singer: 'B Ray',
            path: './assets/songs/song_7.mp3',
            image: './assets/images/imgsong_7.jpg'
        },
        {
            name: 'Dư Tiền',
            singer: 'B Ray',
            path: './assets/songs/song_8.mp3',
            image: './assets/images/imgsong_8.jpg'
        },
        {
            name: '3 Lần Phải Khóc',
            singer: 'B Ray',
            path: './assets/songs/song_9.mp3',
            image: './assets/images/imgsong_9.jpg'
        },
        {
            name: 'Bước Đều Bước',
            singer: 'B Ray',
            path: './assets/songs/song_10.mp3',
            image: './assets/images/imgsong_10.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
        playlist.innerHTML = htmls.join('')
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth

        //Xu ly quay/dung CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xu ly phong to thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xu ly click nut play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
            // Khi song duoc play
            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            // Khi song bi pause
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()

            }

            //Khi tien do bai hat thay doi
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }

            //Xu ly tua song
            progress.onchange = function (e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
        }

        // Xu ly khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) _this.randomSong()
            else _this.nextSong()
            playBtn.click()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xu ly khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) _this.randomSong()
            else _this.prevSong()
            playBtn.click()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }
        // Xu ly bat / tat random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xu ly khi het bai hat
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else nextBtn.click()
        }

        //Xu ly lap lai bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Lang nghe playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            // Xu ly khi click vao song
            if(songNode || !e.target.closest('.option')){
                // Xu ly khi click vao song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    playBtn.click()
                    audio.play()
                }
            }
        }
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong()
    },

    randomSong: function () {
        let newIndex = this.currentIndex
        if (this.randomIndex.length >= this.songs.length) this.randomIndex = [];
        let count = this.randomIndex.length
        // Random 1 bai hat khong trung voi bai trước đó
        // do{
        //     newIndex = Math.floor(Math.random() * this.songs.length)
        // }
        // while(this.currentIndex === newIndex)
        // Bài hát tiếp theo là bài chưa xuất hiện lần nào
        let checked = false;
        while (!checked || this.currentIndex === newIndex) {
            newIndex = Math.floor(Math.random() * this.songs.length)
            checked = this.randomIndex.every((a) => {
                return a !== newIndex
            })
        }
        this.randomIndex.push(newIndex)
        this.currentIndex = this.randomIndex[count]
        this.loadCurrentSong()
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        },300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = `${this.currentSong.path}`
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },

    start: function () {
        // Gán cấu hình config từ bộ nhớ vào giao diện
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        //Lắng nghe / xử lý các sự kiện
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()
