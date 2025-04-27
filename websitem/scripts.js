document.addEventListener("DOMContentLoaded", () => {
    // Kullanıcı Kaydı
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newUsername = document.getElementById("newUsername").value;
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (newPassword !== confirmPassword) {
                alert("Şifreler eşleşmiyor!");
                return;
            }

            // Kullanıcı bilgilerini localStorage'a kaydet
            localStorage.setItem(newUsername, newPassword);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            window.location.href = "login.html";
        });
    }

    // Kullanıcı Girişi
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const storedPassword = localStorage.getItem(username);
            if (storedPassword && storedPassword === password) {
                alert("Giriş başarılı!");
                window.location.href = "index.html";
            } else {
                alert("Kullanıcı adı veya şifre hatalı.");
            }
        });
    }
});
