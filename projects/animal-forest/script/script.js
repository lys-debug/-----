document.addEventListener("DOMContentLoaded", () => {
  function fitViewport() {
    const baseW = 1920;
    const baseH = 1080;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scale = Math.min(vw / baseW, vh / baseH);

    const vp = document.querySelector(".viewport");
    if (!vp) return;

    vp.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  fitViewport();
  window.addEventListener("resize", fitViewport);


  const pages = document.querySelectorAll(".page");

  function showPage(index) {
    pages.forEach((page, i) => page.classList.toggle("active", i === index));
  }

  showPage(0);

  const startBtn = document.querySelector(".start_btn");
  if (startBtn) startBtn.addEventListener("click", () => showPage(1));

  const nameInput = document.querySelector(".name_input");
  const okBtn = document.querySelector(".name_ok_btn");
  let isNameSubmitting = false;

  function goNextFromName() {
    if (isNameSubmitting) return;
    const name = (nameInput?.value || "").trim();
    if (!name) return;

    isNameSubmitting = true;

    localStorage.setItem("userName", name);
    showPage(2);
    startSpeechTyping();

    setTimeout(() => (isNameSubmitting = false), 300);
  }

  if (nameInput && okBtn) {
    nameInput.addEventListener("input", () => {
      okBtn.classList.toggle("show", nameInput.value.trim() !== "");
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goNextFromName();
      }
    });

    okBtn.addEventListener("click", goNextFromName);
  }

  let typingTimer = null;
  let isTyping = false;

  function stopTyping() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    isTyping = false;
  }

  function startSpeechTyping() {
    const textEl = document.querySelector(".speech_text");
    if (!textEl) return;
    if (isTyping) return;
    stopTyping();

    textEl.innerHTML = "";
    const userName = localStorage.getItem("userName") || "주민";

    const fullText =
      `${userName}님 어서오세요~!\n` +
      `동물의 숲, 나와 닮은 주민찾기에 오신 걸 환영해요!\n` +
      `이제 ${userName}님과 닮은 주민을 찾으러 가볼까요?`;

    let i = 0;
    isTyping = true;

    const type = () => {
      if (!isTyping) return;

      if (i >= fullText.length) {
        stopTyping();
        return;
      }

      const ch = fullText[i];
      textEl.innerHTML += ch === "\n" ? "<br>" : ch;
      i++;

      typingTimer = setTimeout(type, 70);
    };

    type();
  }

  const speechBox = document.querySelector(".speech_box");
  const speechArrow = document.querySelector(".speech_arrow");

  const qIndexEl = document.querySelector(".q_index");
  const qTextEl = document.querySelector(".q_text");
  const yesBtn = document.querySelector(".btn_yes");
  const noBtn = document.querySelector(".btn_no");
  const prevQBtn = document.querySelector(".btn_prev_q");

  const questions = [
    "새로운 사람과 금방 친해지는 편이야?",
    "계획보다 즉흥적으로 움직일 때 더 신나?",
    "기분이나 감정에 따라 하루 분위기가 크게 달라지는 편이야?",
    "혼자 있는 시간보다 사람들과 있을 때 에너지가 나?",
    "해야 할 일보다 하고 싶은 일을 먼저 하는 편이야?",
    "누군가에게 내 이야기를 털어놓는게 편해?"
  ];

  let currentQIndex = 0;
  let answers = [];
  let isTransitioning = false;

  function renderQuestion() {
    if (!qIndexEl || !qTextEl) return;

    if (currentQIndex < 0) currentQIndex = 0;
    if (currentQIndex >= questions.length) currentQIndex = questions.length - 1;

    qIndexEl.textContent = `${currentQIndex + 1} / ${questions.length}`;
    qTextEl.textContent = questions[currentQIndex];

    if (prevQBtn) {
      prevQBtn.disabled = currentQIndex === 0;
      prevQBtn.classList.toggle("disabled", currentQIndex === 0);
    }
  }

  function goToPage4() {
    showPage(3);
    renderQuestion();
  }

  if (speechBox) speechBox.addEventListener("click", goToPage4);
  if (speechArrow) {
    speechArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      goToPage4();
    });
  }

  function finishQuestion() {
    const yesCount = answers.filter(Boolean).length;
    localStorage.setItem("yesCount", String(yesCount));
    renderResult(yesCount);
    showPage(4);
  }

  function handleAnswer(isYes) {
    if (isTransitioning) return;
    isTransitioning = true;

    answers[currentQIndex] = isYes;

    if (qTextEl && qIndexEl) {
      qTextEl.classList.add("fade-out");
      qIndexEl.classList.add("fade-out");
    }

    setTimeout(() => {
      currentQIndex++;

      if (currentQIndex < questions.length) {
        renderQuestion();

        requestAnimationFrame(() => {
          if (qTextEl && qIndexEl) {
            qTextEl.classList.remove("fade-out");
            qIndexEl.classList.remove("fade-out");
          }
        });

        isTransitioning = false;
      } else {
        isTransitioning = false;
        finishQuestion();
      }
    }, 350);
  }

  if (yesBtn && noBtn) {
    yesBtn.addEventListener("click", () => handleAnswer(true));
    noBtn.addEventListener("click", () => handleAnswer(false));
  }

  if (prevQBtn) {
    prevQBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      if (currentQIndex <= 0) return;

      isTransitioning = true;

      if (qTextEl && qIndexEl) {
        qTextEl.classList.add("fade-out");
        qIndexEl.classList.add("fade-out");
      }

      setTimeout(() => {
        currentQIndex--;
        answers[currentQIndex] = undefined;

        renderQuestion();

        requestAnimationFrame(() => {
          if (qTextEl && qIndexEl) {
            qTextEl.classList.remove("fade-out");
            qIndexEl.classList.remove("fade-out");
          }
        });

        isTransitioning = false;
      }, 350);
    });
  }



  function renderResult(yesCnt) {
    const userName = localStorage.getItem("userName") || "주민";

    const nameEl = document.getElementById("resultUserName");
    const charEl = document.getElementById("resultCharacter");
    const sub1El = document.getElementById("resultSub1");
    const sub2El = document.getElementById("resultSub2");
    const typeEl = document.getElementById("resultType");
    const featureEl = document.getElementById("resultFeature");
    const matchEl = document.getElementById("resultMatch");
    const imgEl = document.querySelector(".result_left img");

    if (!nameEl || !charEl || !sub1El || !sub2El || !typeEl || !featureEl || !matchEl || !imgEl) return;

    let key;
    if (yesCnt === 0) key = 0;
    else if (yesCnt === 1 || yesCnt === 2) key = 1;
    else key = yesCnt;

    const results = {
      0: {
        img: "images/0_13.png",
        character: "피우나",
        sub1: `${userName}님은 차분하고 따뜻한 성격의 소유자예요.`,
        sub2: `혼자 있는 시간 속에서도 행복을 느끼고, 언제나 주변을 편안하게 만들어주는 피우나와 닮았어요.`,
        type: "Normal (온화형)",
        feature:
          "부드럽고 친절한 사슴 주민. 낯가림이 있지만 한 번 친해지면 마음을 다 해주는 타입. 자연 속에서 조용히 여유를 즐기는 걸 좋아해요.",
        match: "내향적, 감성형"
      },
      1: {
        img: "images/1-2_13.png",
        character: "릴리안",
        sub1: `${userName}님은 밝고 따뜻한 에너지를 가진 사람이에요!`,
        sub2: `조금은 수줍지만 금세 모두와 친해지고 주변을 웃음으로 가득 채우는 릴리안과 닮았어요.`,
        type: "Peppy (활발형)",
        feature:
          "밝고 긍정적인 토끼 주민. 처음엔 낯을 가리지만 금세 분위기를 이끄는 활발한 에너지를 지녔어요.",
        match: "낯가리지만 긍정적인 사람"
      },
      3: {
        img: "images/3_13.png",
        character: "머샬",
        sub1: `${userName}님은 감성적이면서도 자신만의 중심이 확실한 타입이에요.`,
        sub2: `따뜻하지만 무게감 있는 매력을 가진 머샬과 닮았어요.`,
        type: "Smug (느긋한 자신감형)",
        feature:
          "귀엽지만 카리스마 있는 다람쥐 주민. 감성적이면서 현실적인 밸런스를 잘 맞추는 타입이에요. 혼자 있어도, 함께 있어도 매력적인 균형형.",
        match: "현실적이지만 예술적인 사람"
      },
      4: {
        img: "images/4_13.png",
        character: "줄리아",
        sub1: `${userName}님은 감각적이고 예술적인 영혼의 소유자예요.`,
        sub2: `자신을 표현할 줄 알고, 사람들에게 영감을 주는 화려한 예술가 줄리아와 닮았어요.`,
        type: "Snooty (우아형)",
        feature:
          "예술적 감각이 뛰어난 화려한 타조 주민. 표현력과 개성이 풍부하며, 자신의 감정을 솔직히 드러내는 타입이에요.",
        match: "창의적이고 솔직한 사람"
      },
      5: {
        img: "images/5_13.png",
        character: "레이먼드",
        sub1: `${userName}님은 카리스마와 센스를 모두 갖춘 타입이에요.`,
        sub2: `세련된 매력으로 사람들을 이끄는 멋진 리더형 레이먼드와 닮았어요.`,
        type: "Smug (자신감형)",
        feature:
          "도시적인 세련미를 가진 고양이 주민. 이성적이면서도 유머러스하고, 일할 땐 완벽주의자. 자신감이 넘치고 리더십 있는 성격이에요.",
        match: "주도적이고 논리적인 사람"
      },
      6: {
        img: "images/6_13.png",
        character: "비앙카",
        sub1: `${userName}님은 활발하고 즉흥적인 매력의 소유자예요!`,
        sub2: `새로운 사람과 금방 친해지고 언제나 주변을 밝게 만드는 비앙카와 닮았어요.`,
        type: "Peppy (에너지형)",
        feature:
          "자유롭고 외향적인 호랑이 주민. 즉흥적이고 감정 표현이 풍부해 주변에 활기를 불어넣는 분위기 메이커.",
        match: "활발하고 에너지 넘치는 사람"
      }
    };

    const result = results[key] || results[0];

    nameEl.textContent = userName;
    charEl.textContent = result.character;
    sub1El.textContent = result.sub1;
    sub2El.textContent = result.sub2;
    typeEl.textContent = result.type;
    featureEl.textContent = result.feature;
    matchEl.textContent = result.match;
    imgEl.src = result.img;
  }



  const retryBtn = document.querySelector(".btn_retry");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      localStorage.removeItem("yesCount");
      localStorage.removeItem("userName");

      stopTyping();

      currentQIndex = 0;
      answers = [];
      isTransitioning = false;

      renderQuestion();
      showPage(1);
    });
  }
});