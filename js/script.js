$(function () {});


// ============================
// スクロール固定用変数と関数
// ============================
let scrollPosition = 0;

function lockScroll() {
  scrollPosition = $(window).scrollTop();

  $("html").css({
    position: "fixed",
    top: `-${scrollPosition}px`,
    width: "100%",
    overflow: "hidden",
  });

  $("body").addClass("no-scroll");
}

function unlockScroll() {
  $("html").css({
    position: "",
    top: "",
    width: "",
    overflow: "",
  });

  $("body").removeClass("no-scroll");
  $(window).scrollTop(scrollPosition);
}

// ハンバーガーメニュー
$(".hamburger-wrap,.js-drawer,.drawer-menu__item a").click(function () {
    $(".js-hamburger").toggleClass("is-active");
    $(".js-drawer").toggleClass("is-active");
     // ハンバーガー開いている場合はトップへ戻るボタンを非表示、スクロール固定。閉じたら閉じたらスクロール固定解除
    if ($(".js-drawer").hasClass("is-active")) {
        $(".js-page-top").stop(true,true).fadeOut(300);
        lockScroll();
    } else {
        unlockScroll();
    }
});


// サイト内移動
var headerHeight = $('.js-header').outerHeight();
$('a[href^="#"]').click(function(){
  var id = $(this).attr('href');
  var position = $(id).offset().top - headerHeight + 1;
  $('html,body').animate({ scrollTop: position}, 500);
  $("#hamburger").removeClass("is-active");
  $("#drawer").removeClass("is-active");
  $("body").removeClass("no-scroll");
  return false;
});


//　top-voice　スライダー
$(function(){
  const $slider = $('.p-slider');
  $slider.slick({
    slidesToShow: 3,        // 一度に表示するスライド数
    slidesToScroll: 1,      // 一度にスライドする数
    arrows: true,           // 矢印の表示
    dots: false,            // ドットナビ非表示
    infinite: true,         // 無限ループ
    autoplay: true,         // 自動再生
    autoplaySpeed:3000,
    speed: 600,               // スライド速度（ms）
    pauseOnHover: false,       // ホバーしても止めない
    pauseOnFocus: false,       // フォーカスしても止めない（矢印クリック時など）
    pauseOnDotsHover: false,   // ドット操作でも止めない
    cssEase: 'ease',
    prevArrow: '<button type="button" class="slick-prev p-slider__prev"><img src="./images/arrow-left.svg" alt="前へ"></button>',
    nextArrow: '<button type="button" class="slick-next p-slider__next"><img src="./images/arrow-right.svg" alt="次へ"></button>',
    responsive: [
      {
        breakpoint: 768,    // スマホ表示
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  // クリックとドラッグを区別
  let isDragging = false;

  $slider.on('mousedown touchstart', function() {
    isDragging = false;
  });

  $slider.on('mousemove touchmove', function() {
    isDragging = true;
  });

  $slider.on('mouseup touchend', 'a', function(e) {
    if (isDragging) {
      e.preventDefault();
    } else {
      const href = $(this).attr('href');
      if (href) window.location.href = href;
    }
  });
});


// アコーディオン
$(function () {
  $('.js-accordion-button').on('click', function () {
    var $content = $(this).find('.js-accordion-content');
    if ($content.is(':visible')) {
      $content.slideUp(300);
      $(this).removeClass('is-active');
    } else {
      // jQueryのslideDownでblockが入る前にflex指定
      $content
        .css('display', 'flex')
        .hide()
        .slideDown(300, function () {
          // 最終的にflex維持
          $(this).css('display', 'flex');
        });
      $(this).addClass('is-active');
    }
  });
});


// ボタン表示非表示
$(function () {
  const pageTop = $(".js-page-top");
  const pageContact = $(".js-page-contact");
  const footer = $(".js-footer");

  // 初期は非表示
  pageTop.hide();
  pageContact.hide();

  // 表示・非表示制御
  function toggleButtons() {
    const scroll = $(window).scrollTop();
    const isDrawerOpen = $(".js-drawer").hasClass("is-active");

    if (isDrawerOpen) {
      pageTop.stop(true, true).fadeOut(300);
      pageContact.stop(true, true).fadeOut(300);
      return;
    }

    if (scroll > 100) {
      if (!pageTop.is(":visible")) pageTop.stop(true).fadeIn(300);
      if (pageContact.length && !pageContact.is(":visible")) pageContact.stop(true).fadeIn(300);
    } else {
      if (pageTop.is(":visible")) pageTop.stop(true).fadeOut(300);
      if (pageContact.is(":visible")) pageContact.stop(true).fadeOut(300);
    }
  }
  // フッター上部で固定制御
  function fixButtonPositions($button) {
    if ($button.length === 0 || footer.length === 0) return;

    const scroll = $(window).scrollTop();
    const winH = window.visualViewport ? window.visualViewport.height : $(window).height();
    const footerTop = footer.offset().top;
    const btnH = $button.outerHeight();
    const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // 画面幅によって topMargin の値を変更
    const isSp = $(window).width() <= 767;
    const topMarginRem = isSp ? 1.9 : 3.1;
    const topMargin = topMarginRem * remToPx;
    const btnBottomPos = scroll + winH;

    // topボタンなら お問い合わせボタンの高さ＋rem分ずらす
      let extraOffset = 0;
    if ($button.hasClass("js-page-top")) {
      if (pageContact.length) {
        extraOffset = pageContact.outerHeight() + topMargin;
      } else {
        extraOffset = topMargin;
      }
    }

    // ========= footer到達判定 =========
    if (btnBottomPos >= footerTop) {
      // footer上部に止める
      const absoluteTop = footerTop - btnH - extraOffset;
      $button
        .css({
          position: "absolute",
          top: absoluteTop + "px",
          bottom: "auto",
        })
        .addClass("is-absolute");
    } else {
      // 通常時：画面下固定
      $button
        .css({
          position: "fixed",
          top: "auto",
          bottom: `${extraOffset}px`,
        })
        .removeClass("is-absolute");
    }
  }
  // visualViewport変化にも対応（スマホ向け）
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      fixButtonPositions(pageTop);
      fixButtonPositions(pageContact);
    });
  }
  // スクロール・リサイズ時の処理
  $(window).on("scroll resize", function () {
    toggleButtons();
    fixButtonPositions(pageTop);
    fixButtonPositions(pageContact);
  });

  // トップへ戻るクリック動作
  pageTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  // 初期状態チェック
  toggleButtons();
  fixButtonPositions(pageTop);
  fixButtonPositions(pageContact);
});



// planスクロールバー表示用iOS判定関数
function isiOS() {
  return /iP(ad|hone|od)/.test(window.navigator.userAgent);
}

window.addEventListener("load", function () {
  if (!isiOS()) return;

  // ▼ iOS のときだけ .p-plan-table__list にクラス付与
  document.querySelectorAll('.p-plan-table__list').forEach(el => {
    el.classList.add('is-ios');
  });

  // ▼ SimpleBar 適用
  document.querySelectorAll('.p-plan-table__container').forEach(el => {
    if (!el.classList.contains('simplebar-content-wrapper')) {
      const sb = new SimpleBar(el, { autoHide: false }); // 常時表示
      sb.recalculate(); // 横幅確定後にバーを強制計算
    }
  });
});