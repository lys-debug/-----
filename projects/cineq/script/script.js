$(function () {
    var $slideWrap = $('.slide_wrap');
    var $slides    = $slideWrap.children('li');

    if ($slideWrap.length && $slides.length >= 2) {

        var slideCount = $slides.length;
        var step       = 100 / slideCount;
        var speed      = 600;
        var interval   = 6000;
        var isMoving   = false;

        $slideWrap
            .css({
                transition: 'transform ' + speed + 'ms ease',
                transform: 'translateX(0)'
            });

        function goNext() {
            if (isMoving) return;
            isMoving = true;
            $slideWrap.css('transform', 'translateX(-' + step + '%)');
        }

        $slideWrap.on('transitionend webkitTransitionEnd', function (e) {
            if (e.originalEvent.propertyName !== 'transform') return;

            $slideWrap.css('transition', 'none');

            var $firstSlide = $slideWrap.children('li').first();
            $slideWrap.append($firstSlide);
            $slideWrap.css('transform', 'translateX(0)');
            $slideWrap[0].offsetWidth; 
            $slideWrap.css('transition', 'transform ' + speed + 'ms ease');

            isMoving = false;
        });

        setInterval(goNext, interval);
    }



    (function () {
      var hideTimer = null;

      $('.nav ul li .sub').hide();

      $('.nav > ul > li').on('mouseenter', function () {
        clearTimeout(hideTimer);

        var $sub = $(this).children('.sub');

        $('.nav ul li .sub').not($sub).stop(true, true).slideUp(150);

        if ($sub.length) $sub.stop(true, true).slideDown(150);
      });

      $('.nav > ul > li').on('mouseleave', function () {
        var $sub = $(this).children('.sub');

        hideTimer = setTimeout(function () {
          $sub.stop(true, true).slideUp(150);
        }, 120);
      });
    })();



    (function () {
        var $boList  = $('.bo_list');
        var $boItems = $boList.children('li');
        var $btnPrev = $('.btn_prev');
        var $btnNext = $('.btn_next');

        if (!$boList.length || !$boItems.length) return;

        var itemsPerPage = 4;
        var totalItems   = $boItems.length;
        var totalPages   = Math.ceil(totalItems / itemsPerPage);
        var currentPage  = 0;

        $boList.css('transition', 'transform 0.5s ease');

        function updateSlide() {
            var startIndex = currentPage * itemsPerPage;
            var $firstItem = $boItems.eq(0);
            var $target    = $boItems.eq(startIndex);

            if (!$target.length) return;

            var offset = $target.position().left - $firstItem.position().left;

            $boList.css('transform', 'translateX(-' + offset + 'px)');
        }

        updateSlide();

        $btnNext.on('click', function () {
            currentPage++;
            if (currentPage >= totalPages) {
                currentPage = 0;
            }
            updateSlide();
        });

        $btnPrev.on('click', function () {
            currentPage--;
            if (currentPage < 0) {
                currentPage = totalPages - 1;
            }
            updateSlide();
        });

        $(window).on('resize', updateSlide);
    })();




    (function () {
        var $noticeTicker = $('.notice_ticker ul');
        var $noticeItems  = $noticeTicker.children('li');

        if (!$noticeTicker.length || $noticeItems.length <= 1) return;

        var noticeIndex = 0;
        var itemHeight  = $noticeItems.eq(0).outerHeight();
        var speed       = 500;
        var delay       = 3000;

        $noticeTicker.css('transition', 'transform ' + speed + 'ms ease');

        function moveNotice() {
            noticeIndex++;
            $noticeTicker.css('transform', 'translateY(-' + (noticeIndex * itemHeight) + 'px)');

            if (noticeIndex === $noticeItems.length) {
                setTimeout(function () {
                    $noticeTicker.css({
                        transition: 'none',
                        transform: 'translateY(0)'
                    });
                    noticeIndex = 0;

                    setTimeout(function () {
                        $noticeTicker.css('transition', 'transform ' + speed + 'ms ease');
                    }, 20);
                }, speed);
            }
        }

        setInterval(moveNotice, delay);
    })();



    
    (function () {
        var $modal       = $('#videoModal');
        var $videoFrame  = $('#videoFrame');
        var $playButtons = $('.play_btn');
        var $closeBtn    = $('.close');

        if (!$modal.length) return;

        function closeModal(){
            $modal.css('display', 'none');
            $videoFrame.attr('src', '');
        }

        $playButtons.on('click', function (e) {
            e.stopPropagation();
            var videoURL = $(this).data('video');
            $videoFrame.attr('src', videoURL + '&autoplay=1');
            $modal.css('display', 'flex');
        });

        $closeBtn.on('click', closeModal);

        $(document).on('keydown', function(e){
            if (e.key === 'Escape' && $modal.is(':visible')) {
                closeModal();
            }
        });

        $modal.on('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    })();




    (function () {
      var $btnOpen = $('.btn_hamburger');
      var $overlay = $('.m_overlay');
      var $nav     = $('.m_nav');
      var $btnClose= $('.m_close');

      if (!$btnOpen.length || !$nav.length) return;

      function openMenu(){
        $('body').addClass('menu_open');
        $nav.attr('aria-hidden', 'false');
      }
      function closeMenu(){
        $('body').removeClass('menu_open');
        $nav.attr('aria-hidden', 'true');
        $nav.find('.m_sub').stop(true,true).slideUp(150);
      }

      $btnOpen.on('click', function(e){
        e.preventDefault();
        openMenu();
      });

      $btnClose.on('click', closeMenu);
      $overlay.on('click', closeMenu);

      $(document).on('keydown', function(e){
        if (e.key === 'Escape' && $('body').hasClass('menu_open')) closeMenu();
      });

      $nav.find('.has_sub > .m_depth1').on('click', function(e){
        e.preventDefault();
        var $sub = $(this).siblings('.m_sub');
        $nav.find('.m_sub').not($sub).stop(true,true).slideUp(150);
        $sub.stop(true,true).slideToggle(150);
      });
    })();

});