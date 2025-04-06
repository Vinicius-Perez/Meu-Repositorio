document.addEventListener('DOMContentLoaded', function() {
    // Dados dos projetos para o lightbox
    const projectsData = {
        projeto1: {
            media: [
                { type: 'image', src: './src/imagens/projeto1/home.jpg', thumb: './src/imagens/projeto1/home.jpg' },
                { type: 'image', src: './src/imagens/projeto1/sistema.jpg', thumb: './src/imagens/projeto1/sistema.jpg' },
                { type: 'video', src: './src/videos/projeto1/audio.mp4', thumb: './src/imagens/projeto1/imagemaudio.jpg' }
            ]
        },
        projeto2: {
            media: [
                { type: 'image', src: './src/imagens/projeto2/Alexa.jpg', thumb: './src/imagens/projeto2/Alexa.jpg' },
                { type: 'image', src: './src/imagens/projeto2/echo show.jpg', thumb: './src/imagens/projeto2/echo show.jpg' },
                { type: 'video', src: './src/videos/projeto2/automação.mp4', thumb: './src/imagens/projeto2/imagemautomação.jpg' }
            ]
        },
        projeto3: {
            media: [
                { type: 'image', src: './src/imagens/projeto3/mesh e cam.jpg', thumb: './src/imagens/projeto3/mesh e cam.jpg' },
                { type: 'image', src: './src/imagens/projeto3/rede.jpg', thumb: './src/imagens/projeto3/rede.jpg' },
                { type: 'image', src: './src/imagens/projeto3/video porteiro.jpg', thumb: './src/imagens/projeto3/video porteiro.jpg' }
            ]
        }
    };

    // Lightbox functionality
    let currentProject = null;
    let currentIndex = 0;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');

    // Inicializa os projetos com thumbnails para vídeos
    function initializeProjects() {
        document.querySelectorAll('.project-card').forEach(card => {
            const projectId = card.querySelector('.open-lightbox').dataset.project;
            const thumbs = card.querySelectorAll('.thumb[data-type="video"]');
            
            thumbs.forEach((thumb, index) => {
                const videoData = projectsData[projectId].media.find(m => m.type === 'video');
                if (videoData) {
                    const thumbImg = thumb.querySelector('img');
                    if (thumbImg) {
                        thumbImg.src = videoData.thumb;
                    }
                }
            });
        });
    }

    // Thumbnails - Trocar mídia principal
    function setupThumbnailInteractions() {
        document.querySelectorAll('.thumb').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const projectCard = this.closest('.project-card');
                const mainMedia = projectCard.querySelector('.main-media');
                const type = this.dataset.type;
                const src = this.dataset.src;
                const poster = this.dataset.poster;
                
                // Remove active class from all thumbs
                projectCard.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumb
                this.classList.add('active');
                
                // Limpa o conteúdo anterior
                mainMedia.innerHTML = '';
                
                if (type === 'image') {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = this.querySelector('img').alt;
                    img.className = 'main-media-content';
                    mainMedia.appendChild(img);
                } else if (type === 'video') {
                    const video = document.createElement('video');
                    video.src = src;
                    video.poster = poster || '';
                    video.controls = true; // Controles visíveis, mas sem autoplay
                    video.className = 'main-media-content';
                    mainMedia.appendChild(video);
                }
            });
        });
    }

    // Abrir lightbox
    function setupLightbox() {
        document.querySelectorAll('.open-lightbox').forEach(btn => {
            btn.addEventListener('click', function() {
                currentProject = this.dataset.project;
                currentIndex = 0;
                showLightboxMedia();
                document.body.style.overflow = 'hidden';
                lightbox.classList.add('show');
            });
        });
    }

    // Mostrar mídia no lightbox
    function showLightboxMedia() {
        const media = projectsData[currentProject].media[currentIndex];
        
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        
        if (media.type === 'image') {
            lightboxImg.src = media.src;
            lightboxImg.style.display = 'block';
        } else {
            lightboxVideo.src = media.src;
            lightboxVideo.poster = media.thumb;
            lightboxVideo.style.display = 'block';
            lightboxVideo.load();
            // Não chamamos .play() para evitar autoplay
        }
    }

    // Navegação no lightbox
    function navigate(direction) {
        const mediaItems = projectsData[currentProject].media;
        currentIndex = (currentIndex + direction + mediaItems.length) % mediaItems.length;
        showLightboxMedia();
    }

    // Fechar lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        lightboxVideo.pause();
    }

    // Menu mobile
    function setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('.menu');

        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll suave
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Efeito de fade-in nas seções ao rolar
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        
        function checkScroll() {
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight * 0.75) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        }
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        window.addEventListener('load', checkScroll);
        window.addEventListener('scroll', checkScroll);
        
        setTimeout(() => {
            checkScroll();
        }, 500);
    }

    // Esconde o vídeo no projeto 3
    function hideVideoForProject3() {
        const project3 = document.querySelector('.project-card[data-project="projeto3"]');
        if (project3) {
            const videoThumb = project3.querySelector('.thumb[data-type="video"]');
            if (videoThumb) {
                videoThumb.style.display = 'none';
            }
        }
    }

    // Inicialização
    function init() {
        initializeProjects();
        setupThumbnailInteractions();
        setupLightbox();
        setupMobileMenu();
        setupSmoothScroll();
        setupScrollAnimations();
        hideVideoForProject3();
        
        // Event listeners para lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => navigate(-1));
        nextBtn.addEventListener('click', () => navigate(1));

        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Navegação com teclado
        document.addEventListener('keydown', function(e) {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    navigate(-1);
                } else if (e.key === 'ArrowRight') {
                    navigate(1);
                }
            }
        });

        // Atualizar ano no footer
        document.getElementById('year').textContent = new Date().getFullYear();
    }

    // Inicia tudo
    init();
});