class Sangeet {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.player = null;
        this.isPlayerReady = false;
        
        this.songs = [
            {
                id: "JGwWNGJdvx8",
                title: "Shape of You",
                artist: "Ed Sheeran",
                thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg"
            },
            {
                id: "4NRXx6U8ABQ",
                title: "Blinding Lights",
                artist: "The Weeknd",
                thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg"
            },
            {
                id: "HL1UzIK-flA",
                title: "Watermelon Sugar",
                artist: "Harry Styles",
                thumbnail: "https://i.ytimg.com/vi/HL1UzIK-flA/maxresdefault.jpg"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadYouTubeAPI();
        this.loadSongs();
        this.setupEventListeners();
    }
    
    loadYouTubeAPI() {
        window.onYouTubeIframeAPIReady = () => {
            this.initializePlayer();
        };
    }
    
    initializePlayer() {
        this.player = new YT.Player('youtubePlayer', {
            height: '1',
            width: '1',
            videoId: '',
            playerVars: {
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': (event) => {
                    this.isPlayerReady = true;
                    this.showToast('Player ready! 🎵');
                },
                'onStateChange': (event) => {
                    this.handlePlayerStateChange(event);
                }
            }
        });
    }
    
    handlePlayerStateChange(event) {
        const state = event.data;
        
        if (state === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.updatePlayButton();
            this.activateAmbientLighting();
        } else if (state === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.updatePlayButton();
            this.deactivateAmbientLighting();
        }
    }
    
    loadSongs() {
        const grid = document.getElementById('popularGrid');
        
        this.songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'music-card';
            card.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}">
                <div class="music-card-title">${song.title}</div>
                <div class="music-card-artist">${song.artist}</div>
            `;
            
            card.addEventListener('click', () => {
                this.playSong(song);
            });
            
            grid.appendChild(card);
        });
    }
    
    playSong(song) {
        if (!this.isPlayerReady) {
            this.showToast('Player loading...');
            return;
        }
        
        this.currentTrack = song;
        this.player.loadVideoById(song.id);
        this.updateTrackInfo(song);
        this.showToast(`Now playing: ${song.title}`);
    }
    
    updateTrackInfo(song) {
        document.getElementById('trackTitle').textContent = song.title;
        document.getElementById('trackArtist').textContent = song.artist;
    }
    
    updatePlayButton() {
        const btn = document.getElementById('playPauseBtn');
        const icon = btn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    
    setupEventListeners() {
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            if (this.isPlaying) {
                this.player.pauseVideo();
            } else if (this.currentTrack) {
                this.player.playVideo();
            }
        });
    }
    
    activateAmbientLighting() {
        document.getElementById('ambientLighting').classList.add('active');
    }
    
    deactivateAmbientLighting() {
        document.getElementById('ambientLighting').classList.remove('active');
    }
    
    showToast(message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new Sangeet();
});

window.onYouTubeIframeAPIReady = () => {
    if (window.app) {
        window.app.initializePlayer();
    }
};
