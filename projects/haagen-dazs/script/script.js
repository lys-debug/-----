$(function () {
  const items = [
    { img: "images/1_03.png", name: "PEANUT BUTTER CRUNCH", bg: "images/hero_bg_01.png" },
    { img: "images/2_07.png", name: "COOKIES & CHOCOLATE", bg: "images/2_bg_01.png" },
    { img: "images/3_07.png", name: "COOKIES & CREAM", bg: "images/3-bg_01.png" },
    { img: "images/4_07.png", name: "COOKIES & GREEN TEA", bg: "images/4-bg_01.png" },
    { img: "images/5_07.png", name: "STRAWBERRY", bg: "images/5-bg_01.png" }
  ];

  let heroIndex = 0;

  function setHero(i) {
    $(".hero_product img").attr("src", items[i].img);
    $(".hero_product_name").text(items[i].name);
    $(".hero_bg").css("background-image", `url(${items[i].bg})`);
  }

  setHero(heroIndex);

  function changeHero(dir) {
    heroIndex = (heroIndex + dir + items.length) % items.length;

    $(".hero_product img, .hero_product_name, .hero_bg").addClass("fade-out");

    setTimeout(() => {
      setHero(heroIndex);
      $(".hero_product img, .hero_product_name, .hero_bg").removeClass("fade-out");
    }, 600);
  }

  $(".hero_prev").on("click", () => changeHero(-1));
  $(".hero_next").on("click", () => changeHero(1));




  const $brandTargets = $(".brand_intro, .brand_block, .brand_ingredients");

  function revealBrand() {
    const scrollTop = $(window).scrollTop();
    const winH = $(window).height();

    $brandTargets.each(function () {
      const top = $(this).offset().top;
      if (scrollTop + winH * 0.85 > top) {
        $(this).addClass("is-show");
      }
    });
  }

  revealBrand();
  $(window).on("scroll", revealBrand);




  const sources = [
    "images/1.png","images/2.png","images/3.png","images/4.png","images/5.png",
    "images/6.png","images/7.png","images/8.png","images/9.png"
  ];

  let cupIndex = 0;
  let cupTimer = null;
  let isRotating = false;

  const CUP_INTERVAL = 3400;
  const RESUME_DELAY = 500;
  let resumeTimeout = null;

  function rotateCup() {
    if (isRotating) return;
    isRotating = true;

    cupIndex = (cupIndex + 1) % sources.length;

    const $visibleCups = $("#cupTrack .slide_item:visible img");
    $visibleCups.addClass("is-out");

    setTimeout(() => {
      const $visibleAgain = $("#cupTrack .slide_item:visible img");

      $visibleAgain.each(function (i) {
        $(this).attr("src", sources[(cupIndex + i) % sources.length]);
      });

      requestAnimationFrame(() => {
        $visibleAgain.removeClass("is-out");
        isRotating = false;
      });
    }, 520);
  }

  function stopCup() {
    if (cupTimer) clearInterval(cupTimer);
    cupTimer = null;
  }

  function startCup(rotateImmediately = false) {
    stopCup();
    if (rotateImmediately) rotateCup();
    cupTimer = setInterval(rotateCup, CUP_INTERVAL);
  }

  function cancelResume() {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }

  $("#cupTrack .slide_item").on("mouseenter", function () {
    cancelResume();
    stopCup();
  });

  $("#cupTrack .slide_item").on("mouseleave", function () {
    cancelResume();
    resumeTimeout = setTimeout(() => {
      startCup(false);
    }, RESUME_DELAY);
  });
  startCup(true);


  const DATA = {
    happy:   { tag:"행복한", img:"images/modal_1.png", title:"하겐다즈 바닐라", desc:"부드럽고 달콤한 향으로 오늘의 행복을 더 진하게", hash:"#하겐다즈 #바닐라 #백투클래식 #바닐라는아이스크진리지" },
    sad:     { tag:"우울한", img:"images/modal_2.png", title:"하겐다즈 벨지안 초콜릿", desc:"깊고 진한 초콜릿으로 마음을 따뜻하게 감싸드릴게요", hash:"#벨지안초콜릿 #리얼초콜릿 #깊고 진한달콤함" },
    calm:    { tag:"평온한", img:"images/modal_3.png", title:"하겐다즈 그린티", desc:"부드럽고 고요한 향이 마음을 차분히 정돈해 줍니다", hash:"#고품질의그린티 #깊고섬세한맛 #베스트플레이버" },
    flutter: { tag:"설레는", img:"images/modal_4.png", title:"하겐다즈 스트로베리", desc:"상큼한 딸기의 향처럼 오늘의 설렘이 피어납니다", hash:"#딸기과육가득 #리얼딸기 #베스트플레이버" },
    tired:   { tag:"피곤한", img:"images/modal_5.png", title:"하겐다즈 피넛버터 크런치", desc:"달콤한 피넛버터의 고소함이 지친 하루의 끝을 부드럽게 감싸줍니다", hash:"#Only하겐다즈플레이버 #단짠조합 #바삭X꾸덕한식감" }
  };

  function openModal(key) {
    const d = DATA[key];
    if (!d) return;

    $("#moodModalTag").text(d.tag);
    $("#moodModalImg").attr({ src: d.img, alt: d.title });
    $("#moodModalTitle").text(d.title);
    $("#moodModalDesc").text(d.desc);
    $("#moodModalHash").text(d.hash);

    $("#moodModal").addClass("is-open");
    $("body").css("overflow", "hidden");
  }

  function closeModal() {
    $("#moodModal").removeClass("is-open");
    $("body").css("overflow", "");
  }

  $(".mood-btn").on("click", function () {
    openModal($(this).data("mood"));
  });

  $("#moodModal").on("click", "[data-close]", closeModal);

  $(window).on("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });



  $(".hamburger").on("click", function(){
    $(".hd_side").toggleClass("is-open");
  });


  $(".hd_side_close").on("click", function(){
    $(".hd_side").removeClass("is-open");
  });
  


  $(".hd_gnb_nav > li.has-sub > a").on("click", function(e){
    if (window.matchMedia("(max-width: 768px)").matches) {
      e.preventDefault();

      const $li = $(this).parent();

      $li.siblings(".has-sub").removeClass("is-open");

      $li.toggleClass("is-open");
    }
  });

  
});

