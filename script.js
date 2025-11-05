// Loading Screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// Particle Background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Typing Effect
const typingText = document.querySelector('.typing-text');
const words = ['Lior Tal', 'a DevOps Engineer', 'a Full Stack Developer', 'a Cloud Architect', 'a Gamer', 'an Automation Specialist'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards and skill cards
document.querySelectorAll('.project-card, .skill-card').forEach(el => {
    observer.observe(el);
});

// Animate skill bars when in view
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
});

// Parallax effect for floating icons
window.addEventListener('mousemove', (e) => {
    const icons = document.querySelectorAll('.floating-icon');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    icons.forEach((icon, index) => {
        const speed = parseFloat(icon.getAttribute('data-speed')) || 1;
        const x = (mouseX - 0.5) * 20 * speed;
        const y = (mouseY - 0.5) * 20 * speed;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Pipeline Animation - Progress Loader Style
let pipelineAnimationId = null;
let isAnimating = false;
let currentProgress = 0;
const totalStages = 5;
const animationDuration = 8000; // 8 seconds for full cycle

const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isAnimating) {
            startPipelineAnimation();
        } else if (!entry.isIntersecting && isAnimating) {
            stopPipelineAnimation();
        }
    });
}, { threshold: 0.2 });

const pipelineSection = document.querySelector('.pipeline-section');
if (pipelineSection) {
    // Initialize stages as visible
    const stages = document.querySelectorAll('.pipeline-stage');
    stages.forEach(stage => {
        stage.style.opacity = '1';
        stage.style.transform = 'translateY(0)';
    });
    
    pipelineObserver.observe(pipelineSection);
}

function startPipelineAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    currentProgress = 0;
    resetPipeline();
    animatePipelineProgress();
}

function stopPipelineAnimation() {
    isAnimating = false;
    if (pipelineAnimationId) {
        cancelAnimationFrame(pipelineAnimationId);
        pipelineAnimationId = null;
    }
    resetPipeline();
}

function resetPipeline() {
    const stages = document.querySelectorAll('.pipeline-stage');
    const connectors = document.querySelectorAll('.pipeline-connector');
    const progressFill = document.querySelector('.progress-fill');
    
    stages.forEach(stage => {
        stage.classList.remove('active', 'completed');
    });
    connectors.forEach(connector => {
        connector.classList.remove('active', 'completed');
    });
    
    if (progressFill) {
        progressFill.style.width = '0%';
    }
}

function animatePipelineProgress() {
    if (!isAnimating) return;
    
    const startTime = performance.now();
    const progressFill = document.querySelector('.progress-fill');
    const stages = document.querySelectorAll('.pipeline-stage');
    const connectors = document.querySelectorAll('.pipeline-connector');
    
    function updateProgress(currentTime) {
        if (!isAnimating) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min((elapsed / animationDuration) * 100, 100);
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Calculate which stage should be active
        const stageProgress = progress / (100 / totalStages);
        const currentStageIndex = Math.floor(stageProgress);
        
        // Mark completed stages
        for (let i = 0; i < currentStageIndex; i++) {
            if (stages[i]) {
                stages[i].classList.add('completed');
                stages[i].classList.remove('active');
            }
            if (connectors[i]) {
                connectors[i].classList.add('completed');
                connectors[i].classList.remove('active');
            }
        }
        
        // Activate current stage
        if (currentStageIndex < totalStages) {
            // Remove active from all stages
            stages.forEach(stage => stage.classList.remove('active'));
            connectors.forEach(connector => connector.classList.remove('active'));
            
            // Add active to current stage
            if (stages[currentStageIndex]) {
                stages[currentStageIndex].classList.add('active');
                stages[currentStageIndex].classList.remove('completed');
            }
            
            // Activate connector before current stage (except for first stage)
            if (currentStageIndex > 0 && connectors[currentStageIndex - 1]) {
                connectors[currentStageIndex - 1].classList.add('active');
            }
        }
        
        // If progress is complete, mark all as completed and reset
        if (progress >= 100) {
            stages.forEach(stage => {
                stage.classList.add('completed');
                stage.classList.remove('active');
            });
            connectors.forEach(connector => {
                connector.classList.add('completed');
                connector.classList.remove('active');
            });
            
            // Reset and loop after a brief pause
            setTimeout(() => {
                if (isAnimating) {
                    resetPipeline();
                    animatePipelineProgress();
                }
            }, 500);
            return;
        }
        
        pipelineAnimationId = requestAnimationFrame(updateProgress);
    }
    
    pipelineAnimationId = requestAnimationFrame(updateProgress);
}