/**
 * POMPOMPURIN BIRTHDAY EXPERIENCE
 * Complete interactive logic, Web Audio Synthesizer, Gift Unboxing,
 * Confetti effects, and personalization engine.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Si abres la página con ?reset en la URL, reinicia los regalos automáticamente
  if (window.location.search.includes('reset')) {
    localStorage.removeItem('pom_opened_gifts');
    localStorage.removeItem('pom_capibara_pets');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Función global para reiniciar desde la consola si lo deseas: reiniciarRegalos()
  window.reiniciarRegalos = () => {
    localStorage.removeItem('pom_opened_gifts');
    localStorage.removeItem('pom_capibara_pets');
    location.reload();
  };

  const savedGf = localStorage.getItem('pom_gf_name');
  const savedBf = localStorage.getItem('pom_bf_name');
  const savedSub = localStorage.getItem('pom_subtitle');

  const STATE = {
    girlfriendName: (savedGf && savedGf !== 'Mi Niña Bonita') ? savedGf : 'Mi Macarroncito',
    boyfriendName: (savedBf && savedBf !== 'Tu Amorcito') ? savedBf : 'Tu Miope Fav sjjs',
    subtitle: (savedSub && !savedSub.includes('caramelo')) ? savedSub : 'Te amo demasiado, y este sera el primero de muchos cumpleaños juntitos jijiji',
    openedGifts: new Set(JSON.parse(localStorage.getItem('pom_opened_gifts') || '[]')),
    finaleCelebrated: false,
    musicPlaying: false,
    currentMusicMode: 'audio', // 'audio' (mp3) or 'synth' (Web Audio Music Box)
    audioContext: null,
    musicBoxInterval: null,
    chocolatesEaten: new Set(),
    capibaraPets: parseInt(localStorage.getItem('pom_capibara_pets') || '0', 10),
    candleBlown: false
  };

  // Chocolates definitions
  const CHOCOLATES = [
    { id: 1, name: 'Trufa Fresa', icon: '🍓', note: 'Tu sonrisa es mi lugar favorito en todo el mundo. ¡Iluminas todo a tu alrededor!' },
    { id: 2, name: 'Flan Purin', icon: '🍮', note: 'Eres la niña más dulce que existe. La vida a tu lado tiene sabor a caramelo.' },
    { id: 3, name: 'Café Moka', icon: '☕', note: 'Gracias por llenarme de energía, por tus pláticas interminables y tu amor.' },
    { id: 4, name: 'Choco Blanco', icon: '🤍', note: 'Amo cada detalle tuyo. Cada día que pasa me convenzo más de lo afortunado que soy.' },
    { id: 5, name: 'Corazón Nuez', icon: '🌰', note: 'Tienes el corazón más noble, tierno y puro. Nunca dejes de ser tan tú.' },
    { id: 6, name: 'Estrella Miel', icon: '⭐', note: 'Pido mil deseos a las estrellas y en absolutamente todos estás tú.' }
  ];

  // Mascot quotes
  const MASCOT_QUOTES = [
    '¡Pompompurin dice que eres la más linda del universo! 🍮✨',
    '¡Te mando un abrazo suavecito como de peluche! 🐾',
    '¡Hoy se come mucho flancito y pastel! 🎂',
    '¡Alguien te ama con locura hoy y siempre! 💛',
    '¡Feliz feliz cumpleaños a la reina de mi corazón! 👑',
    '¡Eres el caramelo más rico de todos! 🍮💖'
  ];

  // ============================================================
  // 2. DOM ELEMENTS
  // ============================================================
  const introCurtain = document.getElementById('introCurtain');
  const btnStartMagic = document.getElementById('btnStartMagic');
  const bgAudio = document.getElementById('bgAudio');
  const musicWidget = document.getElementById('musicWidget');
  const btnToggleMusic = document.getElementById('btnToggleMusic');
  const btnSwitchMusicSource = document.getElementById('btnSwitchMusicSource');
  const musicTrackTitle = document.getElementById('musicTrackTitle');
  const musicIcon = document.getElementById('musicIcon');

  // Name displays
  const displayGirlfriendName = document.getElementById('displayGirlfriendName');
  const displayBoyfriendName = document.getElementById('displayBoyfriendName');
  const displaySubtitle = document.getElementById('displaySubtitle');
  const footerGirlfriendName = document.getElementById('footerGirlfriendName');
  const chatContactName = document.getElementById('chatContactName');

  // Mascot & Letter
  const interactiveMascot = document.getElementById('interactiveMascot');
  const mascotBubble = document.getElementById('mascotBubble');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeSeal = document.getElementById('envelopeSeal');
  const btnCloseLetter = document.getElementById('btnCloseLetter');

  // Progress
  const unboxedCount = document.getElementById('unboxedCount');
  const progressFill = document.getElementById('progressFill');

  // Finale
  const finaleCard = document.getElementById('finaleCard');
  const interactiveCandle = document.getElementById('interactiveCandle');
  const flame = document.getElementById('flame');
  const btnBlowCandle = document.getElementById('btnBlowCandle');
  const wishReveal = document.getElementById('wishReveal');

  // Customizer
  const btnOpenCustomizer = document.getElementById('btnOpenCustomizer');
  const modalCustomizer = document.getElementById('modal-customizer');
  const customizerForm = document.getElementById('customizerForm');
  const inputGirlfriendName = document.getElementById('inputGirlfriendName');
  const inputBoyfriendName = document.getElementById('inputBoyfriendName');
  const inputSubtitle = document.getElementById('inputSubtitle');

  // ============================================================
  // 3. SOUND SYNTHESIZER (WEB AUDIO API)
  // Zero external dependencies, pure nostalgic chimes & music box
  // ============================================================
  function initAudioContext() {
    if (!STATE.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      STATE.audioContext = new AudioCtx();
    }
    if (STATE.audioContext.state === 'suspended') {
      STATE.audioContext.resume();
    }
  }

  // Play a single crystalline music box bell
  function playBellNote(freq, time = 0, duration = 1.4, volume = 0.18) {
    if (!STATE.audioContext) return;
    const ctx = STATE.audioContext;
    const now = ctx.currentTime + time;

    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle bell overtone
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2.756, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Delicate bell decay envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + duration);
    oscHarmonic.stop(now + duration);
  }

  // Sound Effects (FX)
  const SFX = {
    pop() {
      initAudioContext();
      playBellNote(587.33, 0, 0.25, 0.15); // D5
      playBellNote(880, 0.05, 0.35, 0.2); // A5
    },
    chime() {
      initAudioContext();
      playBellNote(523.25, 0, 0.5, 0.15); // C5
      playBellNote(659.25, 0.1, 0.6, 0.18); // E5
      playBellNote(783.99, 0.2, 0.7, 0.2); // G5
      playBellNote(1046.50, 0.3, 1.2, 0.22); // C6
    },
    bite() {
      initAudioContext();
      playBellNote(440, 0, 0.15, 0.2);
      playBellNote(329.63, 0.08, 0.2, 0.15);
    },
    pet() {
      initAudioContext();
      playBellNote(698.46, 0, 0.3, 0.12); // F5
      playBellNote(880, 0.08, 0.4, 0.15); // A5
      playBellNote(1046.50, 0.16, 0.6, 0.18); // C6
    },
    blow() {
      initAudioContext();
      playBellNote(783.99, 0, 0.3, 0.2);
      playBellNote(659.25, 0.15, 0.3, 0.18);
      playBellNote(523.25, 0.3, 0.5, 0.15);
      setTimeout(() => SFX.victoryFanfare(), 400);
    },
    victoryFanfare() {
      initAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((f, idx) => {
        playBellNote(f, idx * 0.12, 1.5, 0.22);
      });
    }
  };

  // Sweet Romantic Birthday / Sanrio Music Box Loop Engine
  const MUSIC_BOX_MELODY = [
    // G major sweet music box lullaby
    { f: 392.00, d: 0.3 }, // G4
    { f: 493.88, d: 0.3 }, // B4
    { f: 587.33, d: 0.3 }, // D5
    { f: 783.99, d: 0.6 }, // G5
    { f: 659.25, d: 0.3 }, // E5
    { f: 587.33, d: 0.6 }, // D5
    { f: 493.88, d: 0.3 }, // B4
    { f: 440.00, d: 0.6 }, // A4

    { f: 392.00, d: 0.3 }, // G4
    { f: 493.88, d: 0.3 }, // B4
    { f: 587.33, d: 0.3 }, // D5
    { f: 880.00, d: 0.6 }, // A5
    { f: 783.99, d: 0.3 }, // G5
    { f: 987.77, d: 0.8 }, // B5

    { f: 1046.50, d: 0.3 }, // C6
    { f: 987.77, d: 0.3 },  // B5
    { f: 783.99, d: 0.4 },  // G5
    { f: 659.25, d: 0.4 },  // E5
    { f: 587.33, d: 0.5 },  // D5
    { f: 493.88, d: 0.5 },  // B4
    { f: 440.00, d: 0.4 },  // A4
    { f: 392.00, d: 0.9 }   // G4
  ];

  let melodyIndex = 0;
  function startMusicBoxSynth() {
    initAudioContext();
    stopMusicBoxSynth();
    melodyIndex = 0;

    function playNext() {
      if (!STATE.musicPlaying || STATE.currentMusicMode !== 'synth') return;
      const note = MUSIC_BOX_MELODY[melodyIndex];
      playBellNote(note.f, 0, note.d * 2.5, 0.22);

      // Gentle arpeggio backing note
      if (melodyIndex % 2 === 0) {
        playBellNote(note.f * 0.5, 0.05, 1.8, 0.1);
      }

      melodyIndex = (melodyIndex + 1) % MUSIC_BOX_MELODY.length;
      STATE.musicBoxInterval = setTimeout(playNext, note.d * 1000);
    }
    playNext();
  }

  function stopMusicBoxSynth() {
    if (STATE.musicBoxInterval) {
      clearTimeout(STATE.musicBoxInterval);
      STATE.musicBoxInterval = null;
    }
  }

  // ============================================================
  // 4. MUSIC PLAYER CONTROLLER
  // ============================================================
  function playMusic() {
    initAudioContext();
    STATE.musicPlaying = true;
    musicWidget.classList.add('playing');
    musicIcon.textContent = '❚❚';

    if (STATE.currentMusicMode === 'audio') {
      musicTrackTitle.textContent = 'Carefree OST 🎵';
      stopMusicBoxSynth();
      bgAudio.volume = 0.5;
      bgAudio.play().catch(() => {
        // Fallback to synth if audio playback fails
        switchToMusicMode('synth');
      });
    } else {
      musicTrackTitle.textContent = 'Cajita Mágica ✨';
      bgAudio.pause();
      startMusicBoxSynth();
    }
  }

  function pauseMusic() {
    STATE.musicPlaying = false;
    musicWidget.classList.remove('playing');
    musicIcon.textContent = '▶';
    bgAudio.pause();
    stopMusicBoxSynth();
  }

  function toggleMusic() {
    if (STATE.musicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function switchToMusicMode(mode) {
    STATE.currentMusicMode = mode;
    if (STATE.musicPlaying) {
      if (mode === 'audio') {
        stopMusicBoxSynth();
        musicTrackTitle.textContent = 'Carefree OST 🎵';
        bgAudio.volume = 0.5;
        bgAudio.play().catch(() => switchToMusicMode('synth'));
      } else {
        bgAudio.pause();
        musicTrackTitle.textContent = 'Cajita Mágica ✨';
        startMusicBoxSynth();
      }
    } else {
      musicTrackTitle.textContent = mode === 'audio' ? 'Carefree OST 🎵' : 'Cajita Mágica ✨';
    }
  }

  btnToggleMusic.addEventListener('click', toggleMusic);
  btnSwitchMusicSource.addEventListener('click', () => {
    SFX.pop();
    const nextMode = STATE.currentMusicMode === 'audio' ? 'synth' : 'audio';
    switchToMusicMode(nextMode);
  });

  // Start Experience button (Curtain opener)
  btnStartMagic.addEventListener('click', () => {
    initAudioContext();
    SFX.chime();
    triggerConfetti(60);
    introCurtain.classList.add('hidden');
    playMusic();
  });

  // ============================================================
  // 5. CONFETTI & PETAL EFFECTS
  // ============================================================
  function triggerConfetti(count = 70) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: count,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FFEB85', '#FF758F', '#FFCCD5', '#7A4722', '#F7D046', '#FFFFFF']
      });
    } else {
      // DOM Fallback
      createDOMConfetti(count);
    }
  }

  function triggerPetalsShower() {
    SFX.chime();
    if (typeof confetti === 'function') {
      const end = Date.now() + 2500;
      const colors = ['#FFCCD5', '#FFAAA6', '#FF85A1', '#FFF8D6'];
      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          shapes: ['circle']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          shapes: ['circle']
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }

  function createDOMConfetti(count) {
    const colors = ['#FFEB85', '#FF758F', '#FFCCD5', '#7A4722'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.zIndex = '99999';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.top = '50vh';
      el.style.left = '50vw';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.3, 1)';
      document.body.appendChild(el);

      const dx = (Math.random() - 0.5) * 600;
      const dy = (Math.random() - 0.7) * 600;
      setTimeout(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
        el.style.opacity = '0';
      }, 20);

      setTimeout(() => el.remove(), 1300);
    }
  }

  // ============================================================
  // 6. PERSONALIZATION / NAMES SYSTEM
  // ============================================================
  function updateDisplayedNames() {
    displayGirlfriendName.textContent = STATE.girlfriendName;
    footerGirlfriendName.textContent = STATE.girlfriendName;
    displayBoyfriendName.textContent = STATE.boyfriendName;
    displaySubtitle.textContent = STATE.subtitle;
    if (chatContactName) chatContactName.textContent = `${STATE.boyfriendName} 💛`;
  }
  updateDisplayedNames();

  if (btnOpenCustomizer) {
    btnOpenCustomizer.addEventListener('click', () => {
      SFX.pop();
      inputGirlfriendName.value = STATE.girlfriendName;
      inputBoyfriendName.value = STATE.boyfriendName;
      inputSubtitle.value = STATE.subtitle;
      openModal('modal-customizer');
    });
  }

  if (customizerForm) {
    customizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      STATE.girlfriendName = inputGirlfriendName.value.trim() || 'Mi Macarroncito';
      STATE.boyfriendName = inputBoyfriendName.value.trim() || 'Tu Miope Fav sjjs';
      STATE.subtitle = inputSubtitle.value.trim() || 'Te amo demasiado, y este sera el primero de muchos cumpleaños juntitos jijiji';

      localStorage.setItem('pom_gf_name', STATE.girlfriendName);
      localStorage.setItem('pom_bf_name', STATE.boyfriendName);
      localStorage.setItem('pom_subtitle', STATE.subtitle);

      updateDisplayedNames();
      closeModal('modal-customizer');
      SFX.chime();
      triggerConfetti(30);
    });
  }

  // ============================================================
  // 7. INTERACTIVE MASCOT
  // ============================================================
  interactiveMascot.addEventListener('click', () => {
    SFX.pop();
    const randomQuote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
    mascotBubble.textContent = randomQuote;
    mascotBubble.style.transform = 'translateX(-50%) scale(1.15)';
    setTimeout(() => {
      mascotBubble.style.transform = 'translateX(-50%) scale(1)';
    }, 250);
    triggerConfetti(20);
  });

  // ============================================================
  // 8. LOVE ENVELOPE / CARTA
  // ============================================================
  envelopeSeal.addEventListener('click', () => {
    SFX.chime();
    triggerConfetti(40);
    envelopeWrapper.classList.add('opened');
  });

  btnCloseLetter.addEventListener('click', () => {
    SFX.pop();
    envelopeWrapper.classList.remove('opened');
  });

  // ============================================================
  // 9. MODALS CONTROLLER & GIFTS UNBOXING
  // ============================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // If all 4 gifts are opened and we just closed a gift modal, celebrate the Grand Finale!
    if (STATE.openedGifts.size >= 4 && !STATE.finaleCelebrated && modalId.startsWith('modal-') && modalId !== 'modal-finale-unlocked' && modalId !== 'modal-customizer') {
      STATE.finaleCelebrated = true;
      setTimeout(() => {
        openModal('modal-finale-unlocked');
        SFX.victoryFanfare();
        triggerConfetti(120);
      }, 350);
    }
  }

  // Global modal close handlers (X buttons & backdrop)
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      const modal = e.target.closest('.gift-modal');
      if (modal) closeModal(modal.id);
    });
  });

  // Button to go to birthday cake from celebration modal
  const btnGoToCake = document.getElementById('btnGoToCake');
  if (btnGoToCake) {
    btnGoToCake.addEventListener('click', () => {
      closeModal('modal-finale-unlocked');
      const granFinal = document.getElementById('granFinal');
      if (granFinal) {
        granFinal.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        triggerConfetti(100);
      }, 500);
    });
  }

  // Gift opening logic
  function unlockGift(giftType) {
    if (!STATE.openedGifts.has(giftType)) {
      STATE.openedGifts.add(giftType);
      localStorage.setItem('pom_opened_gifts', JSON.stringify([...STATE.openedGifts]));
      SFX.chime();
      triggerConfetti(80);
    } else {
      SFX.pop();
    }

    // Update UI card state
    const card = document.getElementById(`giftCard-${giftType}`);
    if (card) {
      card.classList.add('opened');
      const badge = card.querySelector('.gift-status-badge');
      if (badge) badge.textContent = '¡Abierto! 🎀';
    }

    updateProgressBar();
    openModal(`modal-${giftType}`);
  }

  function updateProgressBar() {
    const total = 4;
    const current = STATE.openedGifts.size;
    unboxedCount.textContent = `${current} de ${total}`;
    const percent = (current / total) * 100;
    progressFill.style.width = `${percent}%`;

    // If all 4 are unlocked, activate the Grand Finale!
    if (current >= total) {
      const finaleEl = document.getElementById('finaleCard');
      if (finaleEl && !finaleEl.classList.contains('unlocked')) {
        finaleEl.classList.add('unlocked');
        setTimeout(() => {
          SFX.victoryFanfare();
          triggerConfetti(120);
        }, 500);
      }
    }
  }

  // Bind clicks on gift cards and buttons
  document.querySelectorAll('.gift-card').forEach(card => {
    const giftType = card.getAttribute('data-gift');
    const openBtn = card.querySelector('.btn-open-gift');
    const boxVisual = card.querySelector('.gift-box-visual');

    const handleOpen = () => unlockGift(giftType);
    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (boxVisual) boxVisual.addEventListener('click', handleOpen);
  });

  // Initial check on load for previously opened gifts
  STATE.openedGifts.forEach(giftType => {
    const card = document.getElementById(`giftCard-${giftType}`);
    if (card) {
      card.classList.add('opened');
      const badge = card.querySelector('.gift-status-badge');
      if (badge) badge.textContent = '¡Abierto! 🎀';
    }
  });
  updateProgressBar();

  // ============================================================
  // 10. MODAL 1: FLORES
  // ============================================================
  const btnShowerPetals = document.getElementById('btnShowerPetals');
  if (btnShowerPetals) {
    btnShowerPetals.addEventListener('click', triggerPetalsShower);
  }

  // ============================================================
  // 11. MODAL 2: CHOCOLATES INTERACTIVE BOX
  // ============================================================
  const chocolatesGrid = document.getElementById('chocolatesGrid');
  const chocolateNoteText = document.getElementById('chocolateNoteText');
  const chocolatesEatenCounter = document.getElementById('chocolatesEatenCounter');

  function renderChocolates() {
    if (!chocolatesGrid) return;
    chocolatesGrid.innerHTML = '';

    CHOCOLATES.forEach(choco => {
      const item = document.createElement('div');
      item.className = 'choco-item';
      if (STATE.chocolatesEaten.has(choco.id)) {
        item.classList.add('eaten');
      }

      item.innerHTML = `
        <span class="choco-item-icon">${choco.icon}</span>
        <span class="choco-item-name">${choco.name}</span>
      `;

      item.addEventListener('click', () => {
        SFX.bite();
        STATE.chocolatesEaten.add(choco.id);
        item.classList.add('eaten');
        chocolateNoteText.textContent = `"${choco.note}"`;
        chocolatesEatenCounter.textContent = `Chocolates probados: ${STATE.chocolatesEaten.size} de ${CHOCOLATES.length}`;

        triggerConfetti(15);
        if (STATE.chocolatesEaten.size === CHOCOLATES.length) {
          setTimeout(() => {
            SFX.chime();
            chocolateNoteText.textContent = "¡Te has terminado todos los chocolates! Pero mi amor por ti nunca se acabará. 🍮🍫💖";
            triggerConfetti(60);
          }, 500);
        }
      });

      chocolatesGrid.appendChild(item);
    });
  }
  renderChocolates();

  // ============================================================
  // 12. MODAL 3: PHONE VOICE MESSAGE & GALLERY
  // ============================================================
  const btnPlayVoice = document.getElementById('btnPlayVoice');
  const voiceTranscript = document.getElementById('voiceTranscript');
  if (btnPlayVoice) {
    btnPlayVoice.addEventListener('click', () => {
      initAudioContext();
      SFX.chime();
      btnPlayVoice.classList.toggle('playing');
      if (voiceTranscript) {
        voiceTranscript.style.display = 'block';
      }
      setTimeout(() => {
        btnPlayVoice.classList.remove('playing');
      }, 2500);
    });
  }

  // ============================================================
  // 13. MODAL 4: CAPIBARA PETTING
  // ============================================================
  const capibaraPetArea = document.getElementById('capibaraPetArea');
  const btnPetCapibara = document.getElementById('btnPetCapibara');
  const petCountBadge = document.getElementById('petCountBadge');
  const capibaraHearts = document.getElementById('capibaraHearts');

  function updatePetCount() {
    if (petCountBadge) {
      petCountBadge.textContent = `${STATE.capibaraPets} caricias 🥰`;
    }
  }
  updatePetCount();

  function petCapibara(e) {
    SFX.pet();
    STATE.capibaraPets++;
    localStorage.setItem('pom_capibara_pets', STATE.capibaraPets);
    updatePetCount();

    // Floating heart from click
    const heart = document.createElement('span');
    heart.className = 'floating-heart-particle';
    const emojis = ['💖', '🍮', '✨', '🐾', '🥰', '🧡'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const rect = capibaraPetArea.getBoundingClientRect();
    const x = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
    const y = e.clientY ? (e.clientY - rect.top) : (rect.height / 2);

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    capibaraHearts.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }

  if (capibaraPetArea) capibaraPetArea.addEventListener('click', petCapibara);
  if (btnPetCapibara) btnPetCapibara.addEventListener('click', (e) => {
    e.stopPropagation();
    petCapibara(e);
  });

  // ============================================================
  // 14. GRAND FINALE: BIRTHDAY CAKE & CANDLE
  // ============================================================
  function blowCandle() {
    if (STATE.candleBlown) return;
    STATE.candleBlown = true;
    SFX.blow();
    flame.classList.add('blown-out');
    btnBlowCandle.style.display = 'none';
    wishReveal.classList.add('active');

    // Massive confetti explosion!
    triggerConfetti(150);
    setTimeout(() => triggerConfetti(100), 500);
    setTimeout(() => triggerPetalsShower(), 1000);
  }

  if (interactiveCandle) interactiveCandle.addEventListener('click', blowCandle);
  if (btnBlowCandle) btnBlowCandle.addEventListener('click', blowCandle);

  // ============================================================
  // 15. FLOATING BACKGROUND STICKERS GENERATOR
  // ============================================================
  const floatingContainer = document.getElementById('floatingStickers');
  const STICKER_ICONS = ['🍮', '🐾', '✨', '💛', '🌸', '🎀', '🍰', '🧸', '🎈'];

  function createFloatingStickers() {
    if (!floatingContainer) return;
    const count = window.innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const sticker = document.createElement('span');
      sticker.className = 'bg-sticker';
      sticker.textContent = STICKER_ICONS[Math.floor(Math.random() * STICKER_ICONS.length)];
      sticker.style.left = `${Math.random() * 95}vw`;
      sticker.style.animationDuration = `${10 + Math.random() * 10}s`;
      sticker.style.animationDelay = `${Math.random() * 8}s`;
      floatingContainer.appendChild(sticker);
    }
  }
  createFloatingStickers();

});
