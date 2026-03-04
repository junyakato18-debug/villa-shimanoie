/* ============================================
   VILLA SITE - script.js
   必要最低限のJavaScript
   ============================================ */

(function () {
  'use strict';

  // ============================================================
  // ヘッダー：スクロール時に背景を変化させる
  // ============================================================
  const header = document.getElementById('site-header');

  if (header && header.classList.contains('transparent')) {
    function updateHeader() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ============================================================
  // ハンバーガーメニュー
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // モバイルナビのリンクをクリックしたらメニューを閉じる
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // フェードインアニメーション（Intersection Observer）
  // ============================================================
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // IntersectionObserver非対応の場合は即表示
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ============================================================
  // お問い合わせフォーム（ダミー送信 → モーダル表示）
  // ============================================================
  const form = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('modal-overlay');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 簡易バリデーション
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('[required][style*="c0392b"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // 送信成功モーダル表示
      if (modalOverlay) {
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      }

      // フォームをリセット
      form.reset();
    });

    // フォーカス時にエラー色をリセット
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('focus', function () {
        this.style.borderColor = '';
      });
    });
  }

  // ============================================================
  // モーダルを閉じる
  // ============================================================
  window.closeModal = function () {
    if (modalOverlay) {
      modalOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  // モーダル外クリックで閉じる
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        window.closeModal();
      }
    });
  }

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
      window.closeModal();
    }
  });

})();
