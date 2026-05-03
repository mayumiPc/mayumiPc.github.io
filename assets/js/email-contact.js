(function () {
  var root = document.querySelector(".footer-email");
  if (!root) return;

  var k = [41, 126, 20, 179];
  var p1 = [68, 14, 119, 158, 77, 27, 98, 214, 69, 17, 100, 214, 91];
  var p2 = [62, 123, 198, 93, 18, 123, 220, 66, 80, 126, 195];
  var buf = p1.concat(p2);
  var email = "";
  for (var i = 0; i < buf.length; i++) {
    email += String.fromCharCode(buf[i] ^ k[i % 4]);
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
