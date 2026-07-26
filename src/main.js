// style.scssを読み込んでViteのコンパイル対象にする
import "/src/scss/style.scss";

// ==========================================================================
// Intersection Observer（交差監視API）によるスクロールフェードイン
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  // アニメーション対象の要素をすべて取得
  const fadeTargets = document.querySelectorAll(".js-fade-target");

  // オブザーバーのオプション設定（画面に10%入ったら発火）
  const observerOptions = {
    root: null, // ビューポートを基準にする
    rootMargin: "0px",
    threshold: 0.1,
  };

  // コールバック関数の定義
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // 要素が画面内に入ってきた場合
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // 一度表示されたら監視を解除して、裏側のパフォーマンスを最適化する（実務QA視点）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 各要素の監視を開始
  fadeTargets.forEach((target) => scrollObserver.observe(target));
});

// ==========================================================================
// レスポンシブ用ハンバーガーメニュー開閉制御
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#js-menu-btn");
  const navMenu = document.querySelector("#js-nav");

  // 要素が存在する場合のみ実行（ヌルポインタ対策・実務品質）
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      // クラスの有無を反転（トグル）させる
      menuBtn.classList.toggle("is-open");
      navMenu.classList.toggle("is-open");
    });

    // リンクをクリックしたら自動的にメニューを閉じる（UX向上）
    const navLinks = document.querySelectorAll(".header__nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("is-open");
        navMenu.classList.remove("is-open");
      });
    });
  }
});

// ==========================================================================
// お品書きページ：カテゴリ動的フィルタリング制御
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".menu-tabs__btn");
  const menuItems = document.querySelectorAll(".menu-item");

  // 🌟実務必須：ページ内にタブボタンが存在する場合のみ実行（エラー防止）
  if (tabButtons.length > 0 && menuItems.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // 1. アクティブなタブボタンのクラスを切り替え
        tabButtons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");

        // 2. 選択されたカテゴリを取得（data-category属性の値）
        const selectedCategory = button.dataset.category;

        // 3. メニューアイテムの表示・非表示を切り替え
        menuItems.forEach((item) => {
          const itemCategory = item.dataset.itemCategory;

          // 「すべて」が選ばれた、またはアイテムのカテゴリが一致した場合
          if (selectedCategory === "all" || itemCategory === selectedCategory) {
            item.classList.remove("is-hidden");
          } else {
            item.classList.add("is-hidden");
          }
        });
      });
    });
  }
});

// ==========================================================================
// お問い合わせページ：touchedフラグ式高機能リアルタイムバリデーション ＆ 二重送信防止
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#js-form");
  const submitBtn = document.querySelector("#js-submit-btn");

  if (form && submitBtn) {
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const subjectSelect = document.querySelector("#subject");
    const messageInput = document.querySelector("#message");

    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const subjectError = document.querySelector("#subject-error");
    const messageError = document.querySelector("#message-error");

    // メールアドレス形式チェック用の正規表現
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateForm() {
      let isAllValid = true;

      // 1. お名前の検証
      if (nameInput.value.trim() === "") {
        isAllValid = false;
        if (nameInput.classList.contains("touched")) {
          nameInput.classList.add("is-invalid");
          nameError.textContent = "お名前を入力してください。";
          nameError.classList.add("is-active");
        }
      } else {
        nameInput.classList.remove("is-invalid");
        nameError.classList.remove("is-active");
      }

      // 2. メールアドレスの検証
      const emailValue = emailInput.value.trim();
      if (emailValue === "") {
        isAllValid = false;
        if (emailInput.classList.contains("touched")) {
          emailInput.classList.add("is-invalid");
          emailError.textContent = "メールアドレスを入力してください。";
          emailError.classList.add("is-active");
        }
      } else if (!emailRegex.test(emailValue)) {
        isAllValid = false;
        if (emailInput.classList.contains("touched")) {
          emailInput.classList.add("is-invalid");
          emailError.textContent =
            "正しいメールアドレスの形式で入力してください。";
          emailError.classList.add("is-active");
        }
      } else {
        emailInput.classList.remove("is-invalid");
        emailError.classList.remove("is-active");
      }

      // 3. 件名（セレクトボックス）の検証
      if (subjectSelect.value === "") {
        isAllValid = false;
        if (subjectSelect.classList.contains("touched")) {
          subjectSelect.classList.add("is-inside"); // セレクト専用エラー検知クラス
          subjectSelect.classList.add("is-invalid");
          subjectError.textContent = "件名を選択してください。";
          subjectError.classList.add("is-active");
        }
      } else {
        subjectSelect.classList.remove("is-invalid");
        subjectError.classList.remove("is-active");
      }

      // 4. 本文の検証
      if (messageInput.value.trim() === "") {
        isAllValid = false;
        if (messageInput.classList.contains("touched")) {
          messageInput.classList.add("is-invalid");
          messageError.textContent = "本文を入力してください。";
          messageError.classList.add("is-active");
        }
      } else {
        messageInput.classList.remove("is-invalid");
        messageError.classList.remove("is-active");
      }

      // すべての必須条件を満たしていれば送信ボタンの非活性(disabled)を解除
      submitBtn.disabled = !isAllValid;
    }

    // 初回実行（初期状態でボタンを非活性にする）
    validateForm();

    // ユーザーが入力を離脱（blur）または入力中（input）のイベントを監視
    [nameInput, emailInput, subjectSelect, messageInput].forEach((input) => {
      input.addEventListener("blur", () => {
        input.classList.add("touched"); // 触れたフラグを付与[cite: 2]
        validateForm();
      });

      input.addEventListener("input", () => {
        validateForm();
      });
    });

    // 🌟実務必須：送信イベントの制御（二重送信の徹底防止対策）
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // ページのリロードを防ぐ[cite: 2]

      // 防衛策：ボタンがすでに非活性、または送信中クラスがあれば処理を完全に弾く
      if (submitBtn.disabled || submitBtn.classList.contains("is-submitting"))
        return;

      // 【送信中ステート】に移行
      submitBtn.disabled = true;
      submitBtn.classList.add("is-submitting");
      submitBtn.textContent = "送信中...";

      // バックエンドへのAPI通信を模した擬似タイマー（2秒間の非同期処理待ちを再現）
      setTimeout(() => {
        const name = nameInput.value;
        alert(`申し渡しました。ありがとうございます、${name}様。`);

        // フォーム全体の初期化[cite: 2]
        form.reset();
        [nameInput, emailInput, subjectSelect, messageInput].forEach(
          (input) => {
            input.classList.remove("touched", "is-invalid"); // 各種フラグのクリーンアップ[cite: 2]
          },
        );

        // ボタンのステートを「未送信（初期）」に戻す
        submitBtn.classList.remove("is-submitting");
        submitBtn.textContent = "申し渡す（送信する）";

        validateForm(); // 最終評価を行って再びボタンをdisabledにする[cite: 2]
      }, 2000);
    });
  }
});
