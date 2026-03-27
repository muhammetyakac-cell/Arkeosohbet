/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ============================================
      // STRATIGRAPH: Özel Renkler
      // ============================================
      colors: {
        // Toprak Tonları (Ana Palet)
        'earth': {
          50: '#FFFBF0',    // Paleontolog'un kağıtı
          100: '#F5E8D7',   // Hava açık kumlar
          200: '#E8D5B7',   // Orta kumlu tabaka
          300: '#D2B48C',   // Hafif kum - Neolitik
          400: '#CD7F32',   // Bronze rengi
          500: '#8B7355',   // Mermer (Gri-Kahverengi)
          600: '#704214',   // Derin mermer
          700: '#5C4033',   // Çok derin (Paleolitik)
          800: '#3E2723',   // Tabakalar
          900: '#2C1810',   // En derin - Neredeyse siyah
        },

        // Özel Aksan Renkler
        'restore': '#10B981',   // Yeşil - Canlanma/Kurtarma
        'destroy': '#EF4444',   // Kırmızı - Kül/Silme
        'artifact': '#F59E0B',  // Altın - Buluntu/Envanterlik
        'artifact-light': '#FCD34D',  // Parlak altın
      },

      // ============================================
      // STRATIGRAPH: Özel Yazı Stilleri
      // ============================================
      fontFamily: {
        'serif': ['"Georgia"', '"Garamond"', 'serif'], // Antik hissiyat
        'sans': ['"Inter"', '"Segoe UI"', 'sans-serif'], // Modern okunabilirlik
        'mono': ['"Courier New"', 'monospace'], // Monumental yazıtlar
        'special': ['"Tangerine"', 'cursive'], // İsteğe bağlı: El yazısı (npm: tangerine)
      },

      fontSize: {
        // Standart artışına ek olarak Antik Tarzı Başlıklar
        'ancient-xl': ['3.5rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
        'ancient-lg': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.01em' }],
        'ancient-md': ['1.875rem', { lineHeight: '2.25rem' }],
      },

      // ============================================
      // STRATIGRAPH: Özel Animasyonlar
      // ============================================
      animation: {
        // Envanterlik Pulsing
        'artifact-pulse': 'artifactPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Arkeolojik Kazı Shader
        'excavation-glow': 'excavationGlow 3s ease-in-out infinite',
        
        // Oy Partikülü Efekti
        'particle-rise': 'particleRise 0.8s ease-out forwards',
        
        // Mesaj Slide-in (Yeni!)
        'message-slide': 'messageSlide 0.3s ease-out',
        
        // Online Indicator Pulse
        'online-pulse': 'onlinePulse 2s ease-in-out infinite',
        
        // Restore Button Shake (Başarılı oy)
        'restore-shake': 'restoreShake 0.4s ease-out',
      },

      keyframes: {
        artifactPulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 20px rgba(245, 158, 11, 0)',
          },
        },

        excavationGlow: {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 20px rgba(245, 158, 11, 0.8)',
          },
        },

        particleRise: {
          '0%': {
            opacity: '1',
            transform: 'translate(0, 0) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
          },
        },

        messageSlide: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        onlinePulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)',
          },
        },

        restoreShake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

      // ============================================
      // STRATIGRAPH: Özel Temel Stilleri
      // ============================================
      backgroundImage: {
        // Mermer Dokusu (SVG)
        'marble': `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' result='noise'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='400' height='400' fill='%238B7355' filter='url(%23n)' opacity='.4'%3E%3C/rect%3E%3C/svg%3E")`,
        
        // Kumlu Doksu
        'sandy': `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23D2B48C' filter='url(%23s)'%3E%3C/rect%3E%3C/svg%3E")`,
        
        // Blueprint (Mimari Çizim) Tasarımı
        'blueprint': `
          linear-gradient(90deg, rgba(79, 172, 254, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(79, 172, 254, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79, 172, 254, 0.05) 2px, transparent 2px),
          linear-gradient(rgba(79, 172, 254, 0.05) 2px, transparent 2px)
        `,
      },

      backgroundSize: {
        'blueprint': '50px 50px, 50px 50px, 10px 10px, 10px 10px',
      },

      // ============================================
      // STRATIGRAPH: Özel Gölgeler
      // ============================================
      boxShadow: {
        'depth-light': '0 2px 4px rgba(139, 115, 85, 0.1)',
        'depth-mid': '0 8px 16px rgba(139, 115, 85, 0.2)',
        'depth-dark': '0 20px 40px rgba(92, 64, 51, 0.3)',
        
        // Arkeolojik "Kazı Efekti"
        'excavation': '-5px -5px 0px 0px rgba(245, 158, 11, 0.2), 5px 5px 0px 0px rgba(245, 158, 11, 0.1), inset 0 0 10px rgba(139, 115, 85, 0.1)',
        
        // Envanterlik Parıltısı
        'artifact': '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)',
      },

      // ============================================
      // STRATIGRAPH: Özel Sınırlar
      // ============================================
      borderRadius: {
        'layer': '8px', // Katmanların dairesel köşeleri
        'artifact': '12px', // Buluntu kutuları daha yuvarlak
      },

      // ============================================
      // STRATIGRAPH: Padding/Margin Ölçekleri
      // ============================================
      spacing: {
        'layer-gap': '2rem', // Katmanlar arasında boşluk
        'excavation': '1.5rem', // Standart Kazı alanı boşluğu
      },

      // ============================================
      // STRATIGRAPH: Min/Max Genişlikler
      // ============================================
      width: {
        'sidebar': '16rem', // Sidebar kalıtımı
      },

      height: {
        'header': '80px', // Header yüksekliği
      },

      // ============================================
      // STRATIGRAPH: Opacity Seviyeleri
      // ============================================
      opacity: {
        'excavation': '0.95',
        'layer-inactive': '0.6',
        'overlay': '0.85',
      },

      // ============================================
      // STRATIGRAPH: Duration & Delay (Animasyon)
      // ============================================
      transitionDuration: {
        'excavation': '500ms',
      },

      transitionDelay: {
        'layer-1': '0ms',
        'layer-2': '100ms',
        'layer-3': '200ms',
      },

      // ============================================
      // STRATIGRAPH: Z-Index Stratifikasyonu
      // ============================================
      zIndex: {
        'layer-surface': '10',
        'layer-mid': '20',
        'layer-deep': '30',
        'modal': '40',
        'tooltip': '50',
      },
    },
  },

  // ============================================
  // TAILWIND EKLENTILERI
  // ============================================
  plugins: [
    // 1. Özel Utility Classes
    function ({ addUtilities }) {
      const newUtilities = {
        '.strat-text': {
          '@apply text-earth-900 font-serif': {},
        },
        '.strat-heading': {
          '@apply text-ancient-lg font-serif text-earth-800 tracking-tight': {},
        },
        '.strat-card': {
          '@apply bg-white border-l-4 border-earth-300 rounded-lg shadow-depth-mid': {},
        },
        '.strat-button': {
          '@apply px-4 py-2 rounded transition-all duration-300 font-medium': {},
        },
        '.artifact-glow': {
          '@apply animate-artifact-pulse': {},
        },
        '.bg-excavation': {
          '@apply bg-gradient-to-b from-earth-50 via-earth-100 to-earth-50': {},
        },
        '.blueprint-grid': {
          '@apply bg-blue-900': {},
          backgroundImage: 
            'linear-gradient(90deg, rgba(79, 172, 254, 0.15) 1px, transparent 1px), linear-gradient(rgba(79, 172, 254, 0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        },
      };
      addUtilities(newUtilities);
    },

    // 2. Özel Komponent Sınıfları
    function ({ addComponents }) {
      const components = {
        '.btn-restore': {
          '@apply strat-button bg-restore/10 hover:bg-restore/20 text-restore font-semibold':
            {},
        },
        '.btn-destroy': {
          '@apply strat-button bg-destroy/10 hover:bg-destroy/20 text-destroy font-semibold':
            {},
        },
        '.btn-primary': {
          '@apply strat-button bg-earth-700 hover:bg-earth-800 text-white shadow-md':
            {},
        },
        '.card-message': {
          '@apply p-4 bg-white rounded-lg border-l-4 border-artifact hover:bg-earth-50 transition-colors':
            {},
        },
        '.layer-item': {
          '@apply px-4 py-3 rounded-lg transition-all duration-300 hover:bg-opacity-10 cursor-pointer':
            {},
        },
        '.layer-item-active': {
          '@apply scale-105 shadow-excavation': {},
        },
      };
      addComponents(components);
    },
  ],

  // ============================================
  // DARK MODE YÖNETİMİ
  // ============================================
  darkMode: 'class', // 'class' mod: <html class="dark">
};
