// Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('login-error');
  const successMsg = document.getElementById('login-success');
  const loginBtn = loginForm.querySelector('button[type="submit"]');

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Handle form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Clear messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
      // Call login API
      const response = await fetch('http://127.0.0.1:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          remember_me: rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session token
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        successMsg.textContent = 'Login successful! Redirecting...';
        successMsg.style.display = 'block';

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        errorMsg.textContent = data.detail || 'Login failed. Please try again.';
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMsg.textContent = 'An error occurred. Please try again.';
      errorMsg.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In';
    }
  });

  // Sign up link
  const signupLink = document.getElementById('signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'signup.html';
    });
  }
});
