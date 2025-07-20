new Vue({
  el: "#buzz",
  data() {
    return {
      // System states
      isLoaded: false,
      isSuccess: false,
      isAutoStart: false,
      enterPressed: false,
      loaderFinished: false,

      // UI visibility flags
      showHintScreen: false,
      showBuzzButton: true,
      keyboardDimmed: false,
      showKeyboard: false,
      showLang: false,
      showClose: false,
      showAvatar: false,
      showResultScreen: false,
      lastComputerGotPoint: false,
      feedbackWinnerCharFlag: "",
      feedbackLoserCharFlag: "",

      // Animations
      isLightOn: false,
      showVsLightAnimation: false,
      showleftLightAnimation: false,
      autoStartTimeout: null,
      autoStartInProgress: false,
      showComputerTyping: false,

      // Keyboard data
      currentKeyboardLayout: "alphabetic",
      keyboardStatus: "keyboard-normal",
      isShiftActive: false,
      keyboardTimeout: null,
      keyboard: {
        alphabetic: [],
        numeric: [],
      },
      currentInput: "",
      keyStates: {},
      keyboardLampState: "dimmed",

      // Timer
      timeLeft: 60,
      timerInterval: null,
      timerTimeout: null,
      timerDuration: 60000,

      // Quiz content
      currentQuestion: "",
      currentQuestionIndex: -1,
      allQuestions: [],
      askedQuestions: [],
      answerStatus: null,
      isComputerTurn: false,

      // Scores
      studentScore: 0,
      computerScore: 0,
      loScore: 100,
      consecutiveCorrectAnswers: 0,

      // Hints
      hints: [],
      hintPlusTime: {
        unlocked: false,
        used: false,
        image: "./images/hint2-dim.png",
      },
      hintShowAnswer: {
        unlocked: false,
        used: false,
        image: "./images/hint1-dim.png",
      },
      ComputerChar: "",

      // Avatar & language
      currentLang: "en",
      langImage: "./images/arabic.png",
      selectedAvatar: "girl",
      avatarOptions: ["girl", "boy"],
      currentAvatarIndex: 0,
      congratsMessage: "",
      activeComputerCharFlag: "",

      // Stage flags
      isGirlStageLoaded: false,
      isBoyStageLoaded: false,
      isChooseAvatarLoaded: false,
      isIntroStageLoaded: false,
      isBuzzScreenLoaded: false,

      // Character display flags
      showGirlStage: false,
      showBoyStage: false,
      showBoyCharVs2: false,
      showBoyRight: false,
      showGirlCharVs: false,
      showBoyCharVs1: false,

      // Animation segments
      animationSegments: {
        avatarTransitionPrev: [0, 1],
        avatarTransitionNext: [1, 7],
        avatarSelectHighlight: [0, 9],
      },
      questionAlreadyLoaded: false,

      // Audio
      audio: {
        backgroundMusic: null,
        wrongSound: null,
        correctSound: null,
      },
      isMuted: false,

      // Lamps
      lamps: Array.from({ length: 6 }, (_, i) => ({
        state: 0,
        x: 38 + 5 * i,
        y: 61,
      })),
      lampsRight: Array.from({ length: 6 }, (_, i) => ({
        state: 0,
        x: 63 - 5 * i,
        y: 61,
      })),
      leftLampStates: [
        "./images/dim-lamp.png",
        "./images/r-lamp.png",
        "./images/w-lamp.png",
      ],
      rightLampStates: [
        "./images/rdim-lamp.png",
        "./images/rr-lamp.png",
        "./images/rw-lamp.png",
      ],

      // Posts
      posts: [
        {
          questions: [],
          counterCorrect: 0,
          LOcorrectcounter: 0,
          loTargets: null,
          SubType: "Input",
          subjectId: "",
          conceptId: "",
          unitId: "",
          lessonId: "",
          title: "",
          keywords: "",
          learningObjectives: "",
          bloomLevels: [],
          type: "",
          loDegree: null,
          UserDegree: 0,
          startTime: "",
          endTime: "",
          numberOfquestion: 3,
          hint: true,
          items: [],
        },
      ],
    };
  },

  computed: {
    activeKeyboardKeys() {
      return this.keyboard[this.currentKeyboardLayout] || [];
    },
    keyboardDimmed() {
      return this.autoStartActive;
    },
    keyboardRows() {
      const keys = this.activeKeyboardKeys;
      const rows = [];

      if (this.currentKeyboardLayout === "alphabetic") {
        rows.push(keys.slice(0, 10));
        rows.push(keys.slice(10, 19));
        rows.push(keys.slice(19, 26));
        rows.push(keys.slice(26, 31));
      } else {
        rows.push(keys.slice(0, 10));
        rows.push(keys.slice(10, 20));
        rows.push(keys.slice(20, 30));
        rows.push(keys.slice(30, 35));
      }
      return rows;
    },
    finalScoreOutOf100() {
      return (this.studentScore / this.loScore) * 100;
    },
    ComputerScoreOutOf100() {
      return (this.computerScore / this.loScore) * 100;
    },
    currentComputerChar() {
      return this.computerCharMap[this.activeComputerCharFlag] || {};
    },
    ComputerChar() {
      return this.currentComputerChar.name || "";
    },
  },

  mounted() {
    this.initAudio();
    this.initApp();
  },

  beforeDestroy() {
    this.cleanupEventListeners();
    this.cleanupTimers();
    this.cleanupAnimations();
  },

  // ==================== MAIN METHODS ====================
  methods: {
    // ========== INITIALIZATION METHODS ==========
    initApp() {
      try {
        this.restData();
        this.updateSafeArea();
        this.postQuestions();
      } catch (error) {
        console.error("Error in initApp:", error);
      }
    },

    initAudio() {
      this.audio.backgroundMusic = new Audio("./sound/background-music.mp3");
      this.audio.correctSound = new Audio("./sound/ناسي كل حاجة - دندنها.mp3");
      this.audio.wrongSound = new Audio("./sound/اسكت - دندنها.mp3");
    },

    // ========== UI HANDLER METHODS ==========
    updateSafeArea() {
      const container = document.getElementById("container");
      const safeArea = document.getElementById("safeArea");
      if (!container || !safeArea) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const safeWidth = (1550 / 1800) * width;
      const safeHeight = (835 / 1200) * height;

      safeArea.style.position = "absolute";
      safeArea.style.width = `${safeWidth}px`;
      safeArea.style.height = `${safeHeight}px`;
      safeArea.style.left = `${(width - safeWidth) / 2}px`;
      safeArea.style.top = `${(height - safeHeight) / 2}px`;
    },

    handleResize() {
      this.updateSafeArea();
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.audio.backgroundMusic.pause();
      } else {
        this.audio.backgroundMusic
          .play()
          .catch((e) => console.log("no sound found", e));
      }
    },

    playSound(soundType) {
      if (this.isMuted) return;

      try {
        const sound = this.audio[soundType];
        sound.currentTime = 0;
        sound
          .play()
          .catch((e) => console.log(`Cannot play ${soundType} sound:`, e));
      } catch (e) {
        console.error("Sound error:", e);
      }
    },

    // ========== GAME CONTROL METHODS ==========
    startQuiz(ev) {
      this.clearExistingTimeouts();
      this.initializeQuizUI();

      this.playBuzzIntro(() => {
        this.toggleKeyboardVisibility(true);
        this.setupQuizTimer();
      });
    },

    initializeQuizUI() {
      this.showBuzzButton = false;
      this.keyboardLampState = "on";
    },

    setupQuizTimer() {
      this.startTimer();
    },

    cleanupTimers() {
      clearInterval(this.timerInterval);
      clearTimeout(this.autoStartTimeout);
      clearTimeout(this.startButtonTimeout);
      this.timerInterval = null;
      this.autoStartTimeout = null;
      this.startButtonTimeout = null;
    },

    clearExistingTimeouts() {
      if (this.startButtonTimeout) {
        clearTimeout(this.startButtonTimeout);
        this.startButtonTimeout = null;
      }
      if (this.autoStartTimeout) {
        clearTimeout(this.autoStartTimeout);
        this.autoStartTimeout = null;
      }
    },

    // ========== KEYBOARD HANDLER METHODS ==========
    handleKeyPress(ev, keyId) {
      if (this.isComputerTurn) return;
      if (!keyId) return;

      this.animateKeyPress(ev.currentTarget);

      switch (keyId) {
        case "shift":
          this.toggleShift();
          break;
        case "backspace":
          this.handleBackspace();
          break;
        case "enter":
          this.handleEnter();
          break;
        case "space":
          this.appendChar(" ");
          break;
        case "123":
          this.currentKeyboardLayout = "numeric";
          break;
        case "abc":
          this.currentKeyboardLayout = "alphabetic";
          break;
        default:
          this.appendChar(
            this.isShiftActive ? keyId.toUpperCase() : keyId.toLowerCase()
          );
          break;
      }
    },

    toggleShift() {
      this.isShiftActive = !this.isShiftActive;
    },

    handleBackspace() {
      this.currentInput = this.currentInput.slice(0, -1);
    },

    handleEnter() {
      clearInterval(this.timerInterval);

      if (this.enterPressed) return;
      this.enterPressed = true;

      const isCorrect = this.checkAndSetAnswerStatus();

      if (isCorrect) {
        this.handleCorrectAnswer();
      } else {
        this.handleWrongAnswer();
      }

      setTimeout(() => {
        this.finalizeTurn(isCorrect);
      }, 500);
    },

    // ========== CORRECT ANSWER HANDLERS ==========
    handleCorrectAnswer() {
      this.playSound("correctSound");
      this.congratsMessage = this.getRandomCongratsMessage(true);
      this.updateKeyboardFeedback(true);
      this.playPlayerAnimation(true);
      this.updateScoreAndHints(true);
      this.handleComputerResponse(true);
    },

    // ========== WRONG ANSWER HANDLERS ==========
    handleWrongAnswer() {
      this.playSound("wrongSound");
      this.congratsMessage = this.getRandomCongratsMessage(false);
      this.updateKeyboardFeedback(false);
      this.playPlayerAnimation(false);
      this.updateScoreAndHints(false);
      this.handleComputerResponse(false);
    },

    // ========== TURN FINALIZATION ==========
    finalizeTurn(isCorrect) {
      this.showCongratsMessage(isCorrect);
      this.completeTurn(isCorrect);
      this.resetTimerState();
    },
    handleEnterPress(event) {
      if (event.key === "Enter" && !this.enterPressed && this.showKeyboard) {
        this.handleEnter();
      }
    },

    // ========== TIMER METHODS ==========
    startTimer() {
      this.timeLeft = 60;
      let currentFrame = 0;
      const totalFrames = 60;

      if (typeof Timer !== "undefined" && Timer.stop) Timer.stop();
      if (typeof Timer !== "undefined" && Timer.goToAndStop)
        Timer.goToAndStop(0, true);

      this.timerInterval = setInterval(() => {
        if (typeof Timer !== "undefined" && Timer.goToAndStop) {
          Timer.goToAndStop(currentFrame, true);
        }
        currentFrame++;
        this.timeLeft--;

        if (currentFrame >= totalFrames || this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.handleTimeOut();
        }
      }, 1000);
    },

    resetTimerState() {
      clearInterval(this.timerInterval);
      this.timeLeft = 60;
      if (typeof Timer !== "undefined" && Timer.goToAndStop) {
        Timer.goToAndStop(0, true);
      }
    },

    // ========== QUESTION MANAGEMENT METHODS ==========
    postQuestions() {
      this.loaderFinished = false;
      fetch("./data.json")
        .then((res) => res.json())
        .then((data) => {
          this.allQuestions = data.questions || [];
          this.hints = data.hints || [];

          if (data.keyboard) {
            this.keyboard.alphabetic = data.keyboard.alphabetic || [];
            this.keyboard.numeric = data.keyboard.numeric || [];
          }

          this.isSuccess = true;
          this.loaderFinished = true;

          setTimeout(() => {
            introStage.playSegments([0, 70], true);
            introStage.loop = true;
          }, 500);

          if (!this.questionAlreadyLoaded && this.allQuestions.length > 0) {
            this.loadRandomQuestion();
          }

          this.allQuestions.length != 0
            ? setTimeout(() => {
                this.isLoaded = true;
              }, 1000)
            : (this.isLoaded = false);
        })
        .catch((error) => {
          console.error("Error fetching data.json:", error);
          this.isLoaded = false;
          this.isSuccess = false;
        });
    },

    loadRandomQuestion() {
      this.resetTimerState();
      try {
        this.resetAnmination();

        clearInterval(this.timerInterval);

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.remainingTime = this.timerDuration;

        this.timerInterval = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--;
          } else {
            clearInterval(this.timerInterval);
            this.handleEnter();
          }
        }, 1000);

        const availableQuestions = this.allQuestions.filter(
          (q) =>
            !this.askedQuestions.includes(q.id) &&
            q.text &&
            q.id !== undefined &&
            q.id !== null
        );

        if (availableQuestions.length === 0) {
          this.currentQuestion = "No questions";
          this.showResultScreen = true;
          this.showKeyboard = false;

          clearInterval(this.timerInterval);
          this.playDynamicFeedback();

          this.calculateScore();
          this.studentScore = this.finalScore;

          return;
        }

        const randomIndex = Math.floor(
          Math.random() * availableQuestions.length
        );
        const selectedQuestion = availableQuestions[randomIndex];

        this.currentQuestion = selectedQuestion.text;
        this.currentQuestionIndex = this.allQuestions.findIndex(
          (q) => q.id === selectedQuestion.id
        );
        this.askedQuestions.push(selectedQuestion.id);
        this.questionAlreadyLoaded = true;
        this.lampUpdatedForIndex = null;
        this.enterPressed = false;
      } catch (error) {
        console.error("Error in loadRandomQuestion:", error);
      }
    },

    // ========== ANSWER HANDLER METHODS ==========
    checkAndSetAnswerStatus() {
      const isCorrect = this.checkAnswer(this.currentInput);
      this.answerStatus = isCorrect ? "correct" : "wrong";
      return isCorrect;
    },

    checkAnswer(input) {
      const current = this.allQuestions[this.currentQuestionIndex];
      if (!current || !current.answer) return false;

      const normalize = (str) =>
        str
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[\u2019\u2018]/g, "'");

      const userAnswer = normalize(input);
      const correctAnswer = normalize(current.answer);

      return userAnswer === correctAnswer;
    },

    // ========== SCORE & FEEDBACK METHODS ==========
    updateScoreAndHints(isCorrect) {
      if (isCorrect) {
        this.studentScore += 10;
        boyStage.playSegments([50, 100], true);
        girlStage.playSegments([50, 100], true);
        this.consecutiveCorrectAnswers++;
        this.posts[0].LOcorrectcounter++;
        this.posts[0].items.push({
          questionId: this.allQuestions[this.currentQuestionIndex].id,
          userAnswer: this.currentInput.trim(),
          correctAnswer:
            this.allQuestions[this.currentQuestionIndex].answer.trim(),
          winner: "correct",
        });
        this.currentInput = "";
        this.checkAndUnlockHints();
      } else {
        this.posts[0].items.push({
          questionId: this.allQuestions[this.currentQuestionIndex].id,
          userAnswer: this.currentInput.trim(),
          correctAnswer:
            this.allQuestions[this.currentQuestionIndex].answer.trim(),
          winner: "wrong",
        });
        this.currentInput = "";
        this.consecutiveCorrectAnswers = 0;
      }
    },

    calculateScore() {
      const totalQuestions = this.allQuestions.length;
      if (totalQuestions === 0) {
        this.finalScore = 0;
        this.scorePercentage = 0;
        return;
      }

      // Calculate based on 10 points per question (6 questions = 60 total points)
      const maxPossibleScore = 60;
      const rawPercentage = (this.studentScore / maxPossibleScore) * 100;

      // Round to nearest step (0, 17, 33, 50, 67, 83, 100)
      const roundedSteps = [0, 17, 33, 50, 67, 83, 100];
      const closest = roundedSteps.reduce((prev, curr) =>
        Math.abs(curr - rawPercentage) < Math.abs(prev - rawPercentage)
          ? curr
          : prev
      );

      this.finalScore = closest;
      this.scorePercentage = rawPercentage;
      this.studentScore = this.finalScore;
    },

    // ========== HINT METHODS ==========
    checkAndUnlockHints() {
      if (this.consecutiveCorrectAnswers >= 2 && !this.hintPlusTime.unlocked) {
        this.hintPlusTime.unlocked = true;
        this.hintPlusTime.image = "./images/hint2.png";
      }

      if (
        this.consecutiveCorrectAnswers >= 3 &&
        !this.hintShowAnswer.unlocked
      ) {
        this.hintShowAnswer.unlocked = true;
        this.hintShowAnswer.image = "./images/hint1.png";
      }
    },

    usePlusTime() {
      if (this.hintPlusTime.unlocked && !this.hintPlusTime.used) {
        this.timeLeft += 10;
        if (this.timeLeft > 60) this.timeLeft = 60;

        clearInterval(this.timerInterval);
        this.startTimer();

        this.hintPlusTime.used = true;
        this.hintPlusTime.image = "./images/hint2-dim.png";
      }
    },

    useShowAnswer() {
      if (this.hintShowAnswer.unlocked && !this.hintShowAnswer.used) {
        const currentQuestionData =
          this.allQuestions[this.currentQuestionIndex];
        if (currentQuestionData && currentQuestionData.answer) {
          this.currentInput = currentQuestionData.answer.trim();
        }

        this.hintShowAnswer.used = true;
        this.hintShowAnswer.image = "./images/hint1-dim.png";
      }
    },

    // ========== ANIMATION METHODS ==========
    playBuzzIntro(callback) {
      this.isLightOn = true;

      if (this.isAutoStart) {
        this.playAutoStartAnimation(callback);
      } else {
        this.playManualStartAnimation(callback);
      }
    },

    playAutoStartAnimation(callback) {
      this.showVsLightAnimation = true;
      this.showleftLightAnimation = false;

      if (leftLight) leftLight.stop();
      if (vsLight) {
        vsLight.stop();
        vsLight.playSegments([0, 10], true);
      }

      this.setupAnimationCompletionHandler(callback);
      buzzScreen.playSegments([0, 10], true);
    },

    playManualStartAnimation(callback) {
      if (leftLight) {
        leftLight.stop();
        leftLight.playSegments([0, 10], true);
      }

      this.setupAnimationCompletionHandler(callback);
      buzzScreen.playSegments([0, 17], true);
    },

    setupAnimationCompletionHandler(callback) {
      if (!buzzScreen) {
        if (typeof callback === "function") callback();
        return;
      }

      buzzScreen.stop();
      buzzScreen.removeEventListener(
        "complete",
        this._buzzScreenCompletionHandler
      );

      this._buzzScreenCompletionHandler = () => {
        if (typeof callback === "function") callback();
      };

      buzzScreen.addEventListener(
        "complete",
        this._buzzScreenCompletionHandler,
        { once: true }
      );
    },

    playPlayerAnimation(isCorrect) {
      this.showleftLightAnimation = false;
      if (leftLight) leftLight.stop();

      const playerSegment = isCorrect ? [50, 100] : [100, 150];
      const vsInstance =
        this.selectedAvatar === "girl"
          ? girlVs
          : this.selectedAvatar === "boy"
          ? boyVs
          : null;

      if (vsInstance) {
        vsInstance.stop();
        vsInstance.playSegments(playerSegment, true);
      }
    },

    // ========== COMPUTER PLAYER METHODS ==========
    handleComputerResponse(isCorrect) {
      if (!isCorrect) {
        this.handlePlayerIncorrect();
      } else {
        this.handlePlayerCorrect();
      }
    },

    handlePlayerIncorrect() {
      this.showCongratsMessage();
      this.startComputerTurnAnimation();
      setTimeout(() => {
        this.showComputerTyping = true;
      }, 1000);

      setTimeout(() => {
        this.executeComputerTurn();
      }, 3000);
    },

    startComputerTurnAnimation() {
      boyStage.playSegments([100, 150], true);
      girlStage.playSegments([100, 150], true);
    },

    executeComputerTurn() {
      this.showComputerTyping = false;
      const isComputerCorrect = Math.random() < 0.5;

      this.playComputerResponse(isComputerCorrect);
      this.updateComputerScore(isComputerCorrect);
      this.playComputerSound(isComputerCorrect);
    },

    handlePlayerCorrect() {
      this.showComputerTyping = false;
      this.lastComputerGotPoint = false;
      this.playComputerCharacters([100, 150]);
    },

    playComputerResponse(isCorrect) {
      const compSegment = isCorrect ? [50, 100] : [100, 150];
      this.playComputerCharacters(compSegment);
    },

    playComputerCharacters(segment) {
      BoyCharVs2.playSegments(segment, true);
      GirlCharVs.playSegments(segment, true);
      BoyCharVs1.playSegments(segment, true);
    },

    updateComputerScore(isCorrect) {
      if (isCorrect) {
        this.computerScore += 10;
      }
      this.lastComputerGotPoint = isCorrect;
    },

    playComputerSound(isCorrect) {
      const sound = isCorrect ? "correctSound" : "wrongSound";
      this.playSound(sound);
    },
    simulateComputerTurn() {
      const isCorrect = this.determineComputerAnswer();
      this.processComputerTurn(isCorrect);
      return isCorrect;
    },

    determineComputerAnswer() {
      return Math.random() < 0.5;
    },

    processComputerTurn(isCorrect) {
      this.lastComputerGotPoint = isCorrect;

      if (isCorrect) {
        this.computerScore += 10;
      }

      this.playComputerAnimation(isCorrect);
      this.updateLampState(false);
    },

    playComputerAnimation(isCorrect) {
      const compSegment = isCorrect ? [48, 100] : [100, 148];
      BoyCharVs2.playSegments(compSegment, true);
      GirlCharVs.playSegments(compSegment, true);
      BoyCharVs1.playSegments(compSegment, true);
    },
    // ========== AUTO-START METHODS ==========
    prepareAutoStart() {
      if (this.autoStartedForIndex === this.currentQuestionIndex) return;

      this.keyboardDimmed = true;
      this.showComputerTyping = true;
      this.autoStartedForIndex = this.currentQuestionIndex;
      this.autoStartInProgress = true;
      this.isAutoStart = true;
      this.isComputerTurn = true;
    },

    finishAutoStart() {
      setTimeout(() => {
        this.showComputerTyping = false;
        this.showKeyboard = false;
        this.handleTimeOut();
        this.isComputerTurn = false;
        this.autoStartInProgress = false;
        this.scheduleAutoStartAfterKeyboard();
      }, 3000);
    },

    autoStartQuiz() {
      this.prepareAutoStart();
      this.toggleKeyboardVisibility(false);

      this.playBuzzIntro(() => {
        this.toggleKeyboardVisibility(true);
        this.finishAutoStart();
      });
    },

    scheduleAutoStartAfterKeyboard() {
      if (this.autoStartTimeout) {
        clearTimeout(this.autoStartTimeout);
        this.autoStartTimeout = null;
      }

      const delays = [8000, 10000, 15000];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      this.autoStartTimeout = setTimeout(() => {
        this.autoStartQuiz();
      }, randomDelay);
    },

    // ========== TIMEOUT HANDLER METHODS ==========
    handleTimeOut() {
      this.clearAllTimers();
      this.showCongratsMessage = false;
      this.showComputerTyping = true;

      this.simulateComputerTurn();
      this.updateUIOnTimeout();
      this.finalizeTimeout();
    },

    updateUIOnTimeout() {
      this.updateLampState(false);
      document.getElementById("buzzScreen").style.backgroundColor = "#cc0000";
      this.showleftLightAnimation = false;
    },

    finalizeTimeout() {
      setTimeout(() => {
        leftLight.stop();
        this.showComputerTyping = false;
        this.showKeyboard = false;
        this.completeTurn(false);
      }, 3000);

      setTimeout(() => {
        this.isAutoStart = false;
      }, 2000);
    },

    // ========== TURN MANAGEMENT METHODS ==========
    completeTurn(isCorrect) {
      this.updateLampState(isCorrect);
      this.keyboardLampState = "dimmed";

      if (!isCorrect) {
        this.handleIncorrectAnswer();
      }

      this.scheduleNextAutoStart();
      this.resetTurnState();
    },

    resetTurnState() {
      setTimeout(() => {
        this.keyboardStatus = "keyboard-normal";
        this.loadRandomQuestion();
        this.enterPressed = false;
      }, 3000);
    },

    scheduleNextAutoStart() {
      if (this.autoStartTimeout) clearTimeout(this.autoStartTimeout);

      const delays = [8000, 10000, 15000];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      this.autoStartTimeout = setTimeout(() => {
        if (this.showBuzzButton) this.autoStartQuiz();
      }, randomDelay);
    },

    handleIncorrectAnswer() {
      this.currentInput = "";
      this.showVsLightAnimation = true;

      if (vsLight) {
        vsLight.playSegments([0, 10], true);
      }
      this.calculateScore();

      setTimeout(() => {
        this.showVsLightAnimation = false;
        this.showComputerTyping = false;
        this.showKeyboard = false;
      }, 3000);
    },

    // ========== LAMP METHODS ==========

    updateLampState(isPlayerCorrect) {
      if (this.lampUpdatedForIndex === this.currentQuestionIndex) {
        return;
      }

      this.lampUpdatedForIndex = this.currentQuestionIndex;

      this.updatePlayerLamps(isPlayerCorrect);

      this.updateComputerLamps();
    },

    updatePlayerLamps(isCorrect) {
      const nextLampIndex = this.lamps.findIndex((lamp) => lamp.state === 0);

      if (nextLampIndex !== -1) {
        this.$set(this.lamps, nextLampIndex, {
          ...this.lamps[nextLampIndex],
          state: isCorrect ? 1 : 2,
        });
      }
    },

    updateComputerLamps() {
      const nextLampIndex = this.lampsRight.findIndex(
        (lamp) => lamp.state === 0
      );

      if (nextLampIndex === -1) return;

      if (this.isComputerTurn) {
        this.$set(this.lampsRight, nextLampIndex, {
          ...this.lampsRight[nextLampIndex],
          state: this.lastComputerGotPoint ? 1 : 2,
        });
      } else {
        this.$set(this.lampsRight, nextLampIndex, {
          ...this.lampsRight[nextLampIndex],
          state: 2,
        });
      }
    },

    // ========== CHARACTER METHODS ==========
    getRandomGameConfig() {
      const vsSegments = [
        [0, 94],
        [95, 189],
        [190, 284],
      ];
      const characterConfigs = [
        { name: "BoyCharVs1", flag: "showBoyCharVs1" },
        { name: "BoyCharVs2", flag: "showBoyCharVs2" },
        { name: "GirlCharVs", flag: "showGirlCharVs" },
      ];
      const randomIndex = Math.floor(Math.random() * vsSegments.length);
      return {
        vsSegment: vsSegments[randomIndex],
        characterConfig: characterConfigs[randomIndex],
      };
    },

    resetAllCharacterStages() {
      this.showGirlStage = false;
      this.showBoyStage = false;
      this.showGirlCharVs = false;
      this.showBoyCharVs1 = false;
      this.showBoyCharVs2 = false;
    },

    handleVsAnimationCompletion(characterConfig, vsInstance) {
      document.getElementById(`${this.selectedAvatar}Vs`).style.display =
        "none";
      document.getElementById("buzzScreen").style.display = "block";
      buzzScreen.stop();
      buzzScreen.playSegments([0, 1], true);

      this.$nextTick(() => {
        this[characterConfig.flag] = true;
        this.activeComputerCharFlag = characterConfig.flag;

        const charAnim = window[characterConfig.name];
        const segments = this.animationSegments[characterConfig.name];

        if (charAnim && typeof charAnim.play === "function") {
          if (segments?.length) {
            const randomSeg =
              segments[Math.floor(Math.random() * segments.length)];
            charAnim.playSegments(randomSeg, true);
          } else {
            charAnim.play();
          }
        }
      });

      vsInstance.removeEventListener("complete", this.onVsAnimationComplete);
      this.showHintScreen = true;
    },

    // ========== AVATAR & LANGUAGE METHODS ==========
    toggleLang() {
      this.currentLang = this.currentLang === "en" ? "ar" : "en";
      this.langImage =
        this.currentLang === "ar" ? "./images/eng.png" : "./images/arabic.png";

      introStage.playSegments(
        this.currentLang === "ar" ? [120, 170] : [170, 120],
        true
      );
    },

    changeAvatar() {
      this.currentAvatarIndex == 0
        ? [
            chooseAvatar.playSegments([0, 8], true),
            (this.currentAvatarIndex = 1),
            (this.selectedAvatar = "boy"),
          ]
        : [
            chooseAvatar.playSegments([8, 0], true),
            (this.currentAvatarIndex = 0),
            (this.selectedAvatar = "girl"),
          ];
    },

    startGame() {
      this.showAvatar = false;
      chooseAvatar?.destroy();

      const { vsSegment, characterConfig } = this.getRandomGameConfig();
      this.resetAllCharacterStages();

      const vsInstance = this.selectedAvatar === "girl" ? girlVs : boyVs;
      document.getElementById(`${this.selectedAvatar}Vs`).style.display =
        "block";
      vsInstance.stop();
      vsInstance.playSegments(vsSegment, true);

      this.selectedAvatar === "girl"
        ? (this.showGirlStage = true)
        : (this.showBoyStage = true);

      vsInstance.removeEventListener("complete", this.onVsAnimationComplete);

      this.onVsAnimationComplete = () => {
        this.handleVsAnimationCompletion(characterConfig, vsInstance);

        const allCharacters = [
          girlStage,
          boyStage,
          GirlCharVs,
          BoyCharVs2,
          BoyCharVs1,
        ];

        allCharacters.forEach((char) => {
          setTimeout(() => {
            char.loop = true;
            char.playSegments([0, 50], true);
          }, 5);
        });
      };

      vsInstance.addEventListener("complete", this.onVsAnimationComplete);
    },

    // ========== RESULT SCREEN METHODS ==========
    playDynamicFeedback() {
      const myScore = Math.min(this.studentScore, 100);
      const opponentScore = Math.min(this.computerScore, 100);

      const mySegment = this.getReactionSegmentIndex(myScore);
      const opponentSegment = this.getReactionSegmentIndex(opponentScore);

      // Player Feedback
      let playerFeedbackLottie;
      let playerFeedbackElementId;

      if (this.selectedAvatar === "girl") {
        playerFeedbackLottie = girlStageFeedback;
        playerFeedbackElementId = "girl";
      } else {
        playerFeedbackLottie = boyStageFeedback;
        playerFeedbackElementId = "boy";
      }

      // Opponent Feedback
      let opponentFeedbackLottie;
      let opponentFeedbackElementId;

      if (this.activeOpponentCharFlag === "showBoyCharVs1") {
        opponentFeedbackLottie = boyVs1Feedback;
        opponentFeedbackElementId = "computerBoy1";
      } else if (this.activeOpponentCharFlag === "showBoyCharVs2") {
        opponentFeedbackLottie = boyVs2Feedback;
        opponentFeedbackElementId = "computerBoy2";
      } else if (this.activeOpponentCharFlag === "showGirlCharVs") {
        opponentFeedbackLottie = girlVsFeedback;
        opponentFeedbackElementId = "computerGirl";
      }

      if (myScore > opponentScore) {
        this.feedbackWinnerCharFlag = playerFeedbackElementId;
        this.feedbackLoserCharFlag = opponentFeedbackElementId;
        girlStageFeedback.playSegments([0, 69], true);
        boyVs2Feedback.playSegments([140, 209], true);
        boyVs1Feedback.playSegments([140, 209], true);
        girlVsFeedback.playSegments([140, 209], true);

        festival.playSegments([0, 35], true);
      } else if (opponentScore > myScore) {
        this.feedbackWinnerCharFlag = opponentFeedbackElementId;
        this.feedbackLoserCharFlag = playerFeedbackElementId;
        girlStageFeedback.playSegments([140, 209], true);
        boyVs2Feedback.playSegments([0, 69], true);
        boyVs1Feedback.playSegments([0, 69], true);
        girlVsFeedback.playSegments([0, 69], true);
        festival.playSegments([0, 35], true);
      } else {
        this.feedbackWinnerCharFlag = "";
        this.feedbackLoserCharFlag = "";
      }
    },

    getReactionSegmentIndex(score) {
      if ((score = 100)) return 0;
      if ((score = 83)) return 1;
      if ((score = 67)) return 2;
      if ((score = 50)) return 3;
      return 4;
    },

    getBadgeImage(score) {
      if (score >= 60) return "./images/badge5.png";
      if (score >= 40) return "./images/badge4.png";
      if (score >= 30) return "./images/badge3.png";
      if (score >= 20) return "./images/badge2.png";
      return "./images/badge1.png";
    },

    // ========== GAME RESET METHODS ==========
    resetGame() {
      this.studentScore = 0;
      this.computerScore = 0;
      this.askedQuestions = [];

      this.currentQuestionIndex = -1;
      this.currentInput = "";
      this.answerStatus = null;
      this.consecutiveCorrectAnswers = 0;
      this.hintPlusTime = { unlocked: false, used: false };
      this.hintShowAnswer = { unlocked: false, used: false };
      this.showResultScreen = false;
      this.timeLeft = 60;
      this.questionAlreadyLoaded = false;

      this.lamps.forEach((lamp) => (lamp.state = 0));
      this.lampsRight.forEach((lamp) => (lamp.state = 0));

      document.getElementById("buzzScreen").style.display = "block";
      this.loadRandomQuestion();
      this.showAvatar = true;
    },

    restData() {
      this.showGirlStage = false;
      this.showBoyStage = false;
      this.showGirlCharVs = false;
      this.showBoyCharVs2 = false;
      this.showBoyRight = false;
      this.showBoyCharVs1 = false;
    },

    resetAnmination() {
      this.showBuzzButton = true;
      const allCharacters = [
        girlStage,
        boyStage,
        GirlCharVs,
        BoyCharVs2,
        BoyCharVs1,
      ];

      allCharacters.forEach((char) => {
        setTimeout(() => {
          char.loop = true;
          char.playSegments([0, 50], true);
        }, 5);
      });
      vsLight.playSegments([0, 10], true);
      leftLight.playSegments([0, 10], true);
    },

    // ========== UTILITY METHODS ==========
    getRandomCongratsMessage(isCorrect) {
      const correctMessages = ["Great Job", "Excellent", "Perfect", "Amazing"];
      const incorrectMessages = ["Good Try", "Don't Give Up", "Keep Going"];
      return isCorrect
        ? correctMessages[Math.floor(Math.random() * correctMessages.length)]
        : incorrectMessages[
            Math.floor(Math.random() * incorrectMessages.length)
          ];
    },

    appendChar(char) {
      this.currentInput += char;
    },

    showCongratsMessage(isCorrect) {
      if (this.showResultScreen || !this.isLoaded) return;
      clearInterval(this.timerInterval);

      const message = document.createElement("div");
      message.classList.add(
        "congrats-message",
        isCorrect ? "congrats-correct" : "congrats-wrong"
      );
      message.innerText = this.congratsMessage;
      document.body.appendChild(message);

      setTimeout(() => {
        if (document.body.contains(message)) document.body.removeChild(message);
      }, 1000);
    },

    animateKeyPress(el) {
      if (!el) return;
      el.classList.add("key-pressed");
      setTimeout(() => {
        el.classList.remove("key-pressed");
      }, 150);
    },

    updateKeyboardFeedback(isCorrect) {
      this.keyboardStatus = isCorrect ? "keyboard-correct" : "keyboard-wrong";
      setTimeout(() => {
        this.keyboardStatus = "keyboard-normal";
        this.showKeyboard = false;
      }, 3000);
    },

    toggleKeyboardVisibility(show) {
      this.showKeyboard = show;
    },

    // ========== STYLE GETTER METHODS ==========
    getLampStyle(index, side) {
      let lampList;
      let zIndex;
      if (side === "left") {
        lampList = this.lamps;
        zIndex = 100 - index;
      } else {
        lampList = this.lampsRight;
        zIndex = 100 - index;
      }
      const lamp = lampList[index];
      const sizeVW = 4;
      return {
        position: "absolute",
        top: `${lamp.y}%`,
        left: `${lamp.x}%`,
        width: `${sizeVW}vw`,
        height: `${sizeVW}vw`,
        zIndex: zIndex,
        transform: "translate(-50%, -50%)`",
        cursor: "pointer",
      };
    },

    getLampImage(lampState) {
      if (this.selectedAvatar === "girl") {
        return this.leftLampStates[lampState];
      } else {
        return this.rightLampStates[lampState];
      }
    },

    getKeyImage(keyId) {
      const isDimmed = this.isComputerTurn || this.autoStartActive;

      let imageName = "";
      switch (keyId) {
        case "123":
          imageName = "123";
          break;
        case "space":
          imageName = "space";
          break;
        case "enter":
          imageName = "enter";
          break;
        case "shift":
          imageName = "shift";
          break;
        case "backspace":
          imageName = "backspace";
          break;
        default:
          imageName = "keyboardbutton";
      }

      return `./images/${imageName}${isDimmed ? "_dim" : ""}.png`;
    },

    getKeyboardImage() {
      switch (this.keyboardStatus) {
        case "keyboard-correct":
          return "./images/rightAnswer.png";
        case "keyboard-wrong":
          return "./images/wrongAnswer.png";
        default:
          return "./images/normal.png";
      }
    },

    // ========== CLEANUP METHODS ==========
    cleanupEventListeners() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("keydown", this._boundEnterPress);

      if (buzzScreen && this._buzzScreenCompletionHandler) {
        buzzScreen.removeEventListener(
          "complete",
          this._buzzScreenCompletionHandler,
          { once: true }
        );
      }
    },

    cleanupAnimations() {
      if (vsInstance && this.onVsAnimationComplete) {
        vsInstance.removeEventListener("complete", this.onVsAnimationComplete);
      }
    },

    clearAllTimers() {
      clearInterval(this.timerInterval);
      clearTimeout(this.autoStartTimeout);
      clearTimeout(this.startButtonTimeout);
    },

    // ========== INTRO SCREEN METHODS ==========
    goToNext(ev) {
      ev.target.style.display = "none";
      let captured = false;
      let currentFrame = 0;

      introStage.addEventListener("enterFrame", function (e) {
        if (!captured && e.currentTime > 0) {
          currentFrame = e.currentTime;
          introStage.stop();
          captured = true;
          introStage.playSegments([currentFrame, 120], true);
          introStage.loop = false;
        }
      });

      setTimeout(() => {
        this.showClose = true;
      }, 3500);
    },

    closeIntro() {
      introStage.playSegments([170, 170], true);
      introStage.addEventListener(
        "complete",
        () => {
          const introEl = document.getElementById("introStage");
          if (introEl) {
            introStage.destroy();
            introEl.remove();
          }
          this.showLang = false;
          this.showClose = false;
          this.showAvatar = true;
        },
        { once: true }
      );
    },

    closeHint() {
      this.showHintScreen = false;

      if (this.startButtonTimeout) {
        clearTimeout(this.startButtonTimeout);
      }

      const delays = [8000, 10000, 15000];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      this.startButtonTimeout = setTimeout(() => {
        this.autoStartQuiz();
      }, randomDelay);
    },
  },
});
