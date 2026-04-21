// Signup Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const togglePassword = document.getElementById('toggle-password');
  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const errorMsg = document.getElementById('signup-error');
  const successMsg = document.getElementById('signup-success');
  const signupBtn = signupForm.querySelector('button[type="submit"]');

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Toggle confirm password visibility
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = confirmPasswordInput.type === 'password';
      confirmPasswordInput.type = isPassword ? 'text' : 'password';
      toggleConfirmPassword.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Handle form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    // Clear messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';

    try {
      // Validate inputs
      if (!fullName || !email || !username || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!agreeTerms) {
        throw new Error('You must agree to the Terms and Conditions');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Call signup API
      const response = await fetch('http://127.0.0.1:8001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          full_name: fullName,
          password: password,
          confirm_password: confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        successMsg.textContent = 'Account created successfully! Redirecting to login...';
        successMsg.style.display = 'block';

        // Clear form
        signupForm.reset();

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        throw new Error(data.detail || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      errorMsg.textContent = error.message || 'An error occurred. Please try again.';
      errorMsg.style.display = 'block';
      signupBtn.disabled = false;
      signupBtn.textContent = 'Create Account';
    }
  });
});
