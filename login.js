document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordField = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorBox = document.getElementById('error-message');
    const btn = document.getElementById('loginBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Kredensial Akses
            const AUTH_USER = "AK3U";
            const AUTH_PASS = "12345";

            const user = document.getElementById('username').value.trim();
            const pass = passwordField.value;

            if (user === AUTH_USER && pass === AUTH_PASS) {
                // --- TAMBAHKAN BARIS INI ---
                localStorage.setItem('k3_logged_in', 'true'); 
                // ---------------------------

                errorBox.style.display = 'none';
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Memverifikasi Kredensial...';
                btn.style.background = "#27ae60"; 

                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1200);

            } else {
                errorBox.style.display = 'block';
                errorBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username atau Password Salah!';
                
                const box = document.querySelector('.login-box');
                box.style.animation = 'shake 0.3s ease-in-out';
                setTimeout(() => box.style.animation = '', 300);

                passwordField.value = '';
            }
        });
    }

    // Toggle Lihat Password (Tetap sama)
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    }
});