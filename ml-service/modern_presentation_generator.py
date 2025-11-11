"""
Gerador de Apresentação Ultra Moderna e Interativa
Design tecnológico avançado com animações e interatividade
"""

def generate_modern_reveal_js(language='en'):
    """Gera apresentação Reveal.js ultra moderna"""
    
    from modern_content import get_modern_content_en, get_modern_content_pt
    
    if language == 'en':
        content = get_modern_content_en()
        filename = "CryptoGuard_Modern_EN.html"
    else:
        content = get_modern_content_pt()
        filename = "CryptoGuard_Modern_PT.html"
    
    html_template = f"""<!DOCTYPE html>
<html lang="{'en' if language == 'en' else 'pt'}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoGuard AI - {'Investor Pitch' if language == 'en' else 'Apresentação para Investidores'}</title>
    
    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/black.min.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <!-- Particles.js -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Anime.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    
    <style>
        :root {{
            --primary-color: #00D4FF;
            --secondary-color: #0A0E27;
            --accent-color: #FF6B35;
            --success-color: #00FF88;
            --warning-color: #FFD700;
            --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --gradient-cyber: linear-gradient(135deg, #00D4FF 0%, #0A0E27 50%, #FF6B35 100%);
        }}
        
        /* Global Styles */
        .reveal {{
            font-family: 'Exo 2', sans-serif;
            background: var(--secondary-color);
            color: #ffffff;
        }}
        
        .reveal .slides section {{
            text-align: left;
            position: relative;
            overflow: hidden;
        }}
        
        /* Particles Background */
        #particles-js {{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
        }}
        
        /* Typography */
        .reveal h1, .reveal h2, .reveal h3 {{
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 20px var(--primary-color);
        }}
        
        .reveal h1 {{
            font-size: 3.5em;
            background: var(--gradient-cyber);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow 2s ease-in-out infinite alternate;
        }}
        
        .reveal h2 {{
            color: var(--primary-color);
            font-size: 2.5em;
            margin-bottom: 30px;
        }}
        
        .reveal h3 {{
            color: var(--accent-color);
            font-size: 1.8em;
        }}
        
        /* Animations */
        @keyframes glow {{
            from {{ text-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }}
            to {{ text-shadow: 0 0 30px var(--primary-color), 0 0 40px var(--primary-color); }}
        }}
        
        @keyframes pulse {{
            0% {{ transform: scale(1); }}
            50% {{ transform: scale(1.05); }}
            100% {{ transform: scale(1); }}
        }}
        
        @keyframes slideInLeft {{
            from {{ transform: translateX(-100%); opacity: 0; }}
            to {{ transform: translateX(0); opacity: 1; }}
        }}
        
        @keyframes slideInRight {{
            from {{ transform: translateX(100%); opacity: 0; }}
            to {{ transform: translateX(0); opacity: 1; }}
        }}
        
        @keyframes fadeInUp {{
            from {{ transform: translateY(50px); opacity: 0; }}
            to {{ transform: translateY(0); opacity: 1; }}
        }}
        
        /* Cards and Containers */
        .cyber-card {{
            background: rgba(0, 212, 255, 0.1);
            border: 2px solid var(--primary-color);
            border-radius: 15px;
            padding: 25px;
            margin: 15px 0;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }}
        
        .cyber-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 15px 45px rgba(0, 212, 255, 0.5);
        }}
        
        .cyber-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }}
        
        .cyber-card:hover::before {{
            left: 100%;
        }}
        
        /* Statistics Display */
        .stat-container {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }}
        
        .stat-item {{
            text-align: center;
            padding: 20px;
            background: var(--gradient-1);
            border-radius: 15px;
            animation: fadeInUp 0.6s ease;
        }}
        
        .stat-number {{
            font-family: 'Orbitron', monospace;
            font-size: 2.5em;
            font-weight: 900;
            color: var(--success-color);
            text-shadow: 0 0 15px var(--success-color);
            display: block;
        }}
        
        .stat-label {{
            font-size: 0.9em;
            color: #cccccc;
            margin-top: 10px;
        }}
        
        /* Interactive Elements */
        .interactive-button {{
            background: var(--gradient-3);
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .interactive-button:hover {{
            transform: scale(1.1);
            box-shadow: 0 10px 25px rgba(79, 172, 254, 0.5);
        }}
        
        /* Progress Bars */
        .progress-container {{
            margin: 20px 0;
        }}
        
        .progress-bar {{
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }}
        
        .progress-fill {{
            height: 100%;
            background: var(--gradient-3);
            border-radius: 4px;
            transition: width 2s ease;
        }}
        
        /* Grid Layouts */
        .two-column {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }}
        
        .three-column {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }}
        
        /* Icons and Visual Elements */
        .icon-large {{
            font-size: 3em;
            color: var(--primary-color);
            text-shadow: 0 0 20px var(--primary-color);
            margin-bottom: 15px;
        }}
        
        .feature-item {{
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            transition: all 0.3s ease;
        }}
        
        .feature-item:hover {{
            background: rgba(0, 212, 255, 0.1);
            transform: translateX(10px);
        }}
        
        .feature-icon {{
            font-size: 1.5em;
            color: var(--primary-color);
            margin-right: 15px;
            min-width: 40px;
        }}
        
        /* Chart Containers */
        .chart-container {{
            position: relative;
            height: 400px;
            margin: 30px 0;
        }}
        
        /* Competitive Matrix */
        .competitive-matrix {{
            display: grid;
            grid-template-columns: 2fr repeat(4, 1fr);
            gap: 10px;
            margin: 30px 0;
        }}
        
        .matrix-header {{
            background: var(--gradient-1);
            padding: 15px;
            text-align: center;
            font-weight: 600;
            border-radius: 8px;
        }}
        
        .matrix-cell {{
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            transition: all 0.3s ease;
        }}
        
        .matrix-cell.highlight {{
            background: var(--gradient-3);
            color: white;
            font-weight: 600;
        }}
        
        /* Team Cards */
        .team-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }}
        
        .team-card {{
            background: var(--gradient-2);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: all 0.3s ease;
        }}
        
        .team-card:hover {{
            transform: rotateY(5deg) rotateX(5deg);
        }}
        
        /* Funding Visualization */
        .funding-breakdown {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin: 30px 0;
        }}
        
        .funding-item {{
            background: rgba(0, 212, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            border-left: 5px solid var(--primary-color);
        }}
        
        /* Responsive Design */
        @media (max-width: 768px) {{
            .two-column, .three-column {{
                grid-template-columns: 1fr;
            }}
            
            .reveal h1 {{
                font-size: 2.5em;
            }}
            
            .reveal h2 {{
                font-size: 2em;
            }}
        }}
        
        /* Custom Slide Backgrounds */
        .slide-bg-1 {{
            background: var(--gradient-1);
        }}
        
        .slide-bg-2 {{
            background: var(--gradient-2);
        }}
        
        .slide-bg-3 {{
            background: var(--gradient-3);
        }}
        
        /* Loading Animation */
        .loading-animation {{
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary-color);
            animation: spin 1s ease-in-out infinite;
        }}
        
        @keyframes spin {{
            to {{ transform: rotate(360deg); }}
        }}
    </style>
</head>
<body>
    <div id="particles-js"></div>
    
    <div class="reveal">
        <div class="slides">
            {content}
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
    <script>
        // Initialize Particles.js
        particlesJS('particles-js', {{
            particles: {{
                number: {{ value: 80, density: {{ enable: true, value_area: 800 }} }},
                color: {{ value: '#00D4FF' }},
                shape: {{ type: 'circle' }},
                opacity: {{ value: 0.5, random: false }},
                size: {{ value: 3, random: true }},
                line_linked: {{
                    enable: true,
                    distance: 150,
                    color: '#00D4FF',
                    opacity: 0.4,
                    width: 1
                }},
                move: {{
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }}
            }},
            interactivity: {{
                detect_on: 'canvas',
                events: {{
                    onhover: {{ enable: true, mode: 'repulse' }},
                    onclick: {{ enable: true, mode: 'push' }},
                    resize: true
                }}
            }},
            retina_detect: true
        }});

        // Initialize Reveal.js
        Reveal.initialize({{
            hash: true,
            transition: 'convex',
            transitionSpeed: 'fast',
            backgroundTransition: 'zoom',
            controls: true,
            progress: true,
            center: true,
            touch: true,
            loop: false,
            rtl: false,
            shuffle: false,
            fragments: true,
            embedded: false,
            help: true,
            showNotes: false,
            autoSlide: 0,
            autoSlideStoppable: true,
            mouseWheel: false,
            hideAddressBar: true,
            previewLinks: false,
            viewDistance: 3,
            parallaxBackgroundImage: '',
            parallaxBackgroundSize: '',
            parallaxBackgroundHorizontal: null,
            parallaxBackgroundVertical: null
        }});

        // Custom animations on slide change
        Reveal.addEventListener('slidechanged', function(event) {{
            // Animate elements when slide changes
            anime({{
                targets: '.cyber-card',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 800,
                easing: 'easeOutExpo'
            }});
            
            // Animate statistics
            anime({{
                targets: '.stat-number',
                innerHTML: [0, function(el) {{ return el.getAttribute('data-value'); }}],
                duration: 2000,
                round: 1,
                easing: 'easeOutExpo'
            }});
            
            // Animate progress bars
            document.querySelectorAll('.progress-fill').forEach(function(bar) {{
                const width = bar.getAttribute('data-width');
                setTimeout(function() {{
                    bar.style.width = width + '%';
                }}, 500);
            }});
        }});

        // Interactive button effects
        document.addEventListener('DOMContentLoaded', function() {{
            document.querySelectorAll('.interactive-button').forEach(function(button) {{
                button.addEventListener('click', function() {{
                    anime({{
                        targets: this,
                        scale: [1, 1.2, 1],
                        duration: 300,
                        easing: 'easeOutElastic(1, .8)'
                    }});
                }});
            }});
        }});

        // Chart initialization
        function initCharts() {{
            // Market size chart
            const marketCtx = document.getElementById('marketChart');
            if (marketCtx) {{
                new Chart(marketCtx, {{
                    type: 'doughnut',
                    data: {{
                        labels: ['TAM', 'SAM', 'SOM'],
                        datasets: [{{
                            data: [45.8, 12.3, 1.2],
                            backgroundColor: ['#00D4FF', '#FF6B35', '#00FF88'],
                            borderWidth: 0
                        }}]
                    }},
                    options: {{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {{
                            legend: {{
                                labels: {{
                                    color: 'white',
                                    font: {{
                                        family: 'Exo 2'
                                    }}
                                }}
                            }}
                        }}
                    }}
                }});
            }}
            
            // Growth chart
            const growthCtx = document.getElementById('growthChart');
            if (growthCtx) {{
                new Chart(growthCtx, {{
                    type: 'line',
                    data: {{
                        labels: ['2022', '2023', '2024', '2025', '2026'],
                        datasets: [{{
                            label: 'Revenue ($M)',
                            data: [0.2, 2.3, 8.5, 28, 75],
                            borderColor: '#00D4FF',
                            backgroundColor: 'rgba(0, 212, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        }}]
                    }},
                    options: {{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {{
                            y: {{
                                ticks: {{ color: 'white' }},
                                grid: {{ color: 'rgba(255, 255, 255, 0.1)' }}
                            }},
                            x: {{
                                ticks: {{ color: 'white' }},
                                grid: {{ color: 'rgba(255, 255, 255, 0.1)' }}
                            }}
                        }},
                        plugins: {{
                            legend: {{
                                labels: {{
                                    color: 'white',
                                    font: {{ family: 'Exo 2' }}
                                }}
                            }}
                        }}
                    }}
                }});
            }}
        }}

        // Initialize charts when slides are ready
        Reveal.addEventListener('ready', initCharts);
    </script>
</body>
</html>"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    return filename