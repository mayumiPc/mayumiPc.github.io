(function () {
  var root = document.querySelector(".footer-email[data-email-b64]");
  if (!root) return;

  var b64 = root.getAttribute("data-email-b64");
  var email = "";
  try {
    email = window.atob(b64);
  } catch (e) {
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

  var btn = root.querySelector(".footer-email__copy");
  var feedback = root.querySelector(".footer-email__feedback");
  if (!btn) return;

  btn.addEventListener("click", function () {
    function showFail() {
      if (feedback) {
        feedback.textContent = "コピーに失敗しました（ブラウザの制限の可能性があります）";
        feedback.hidden = false;
        window.setTimeout(function () {
          feedback.textContent = "";
          feedback.hidden = true;
        }, 4000);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () {
          if (feedback) {
            feedback.textContent = "コピーしました";
            feedback.hidden = false;
            window.setTimeout(function () {
              feedback.textContent = "";
              feedback.hidden = true;
            }, 2500);
          }
        },
        function () {
          showFail();
        }
      );
      return;
    }

    try {
      var ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok && feedback) {
        feedback.textContent = "コピーしました";
        feedback.hidden = false;
        window.setTimeout(function () {
          feedback.textContent = "";
          feedback.hidden = true;
        }, 2500);
      } else {
        showFail();
      }
    } catch (err) {
      showFail();
    }
  });
})();
