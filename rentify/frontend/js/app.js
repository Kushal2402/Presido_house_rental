// frontend/js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
    const propertyForm = document.querySelector('#property-form');
    const propertiesList = document.querySelector('#properties-list');
  
    // Register Form Submission
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());
  
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Registration successful');
          window.location.href = 'login.html';
        } else {
          alert(result.message);
        }
      });
    }
  
    // Login Form Submission
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
  
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token);
          alert('Login successful');
          window.location.href = 'seller_dashboard.html';
        } else {
          alert(result.message);
        }
      });
    }
  
    // Property Form Submission
    if (propertyForm) {
      propertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(propertyForm);
        const data = Object.fromEntries(formData.entries());
  
        const response = await fetch('http://localhost:5000/api/property/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Property posted successfully');
          propertyForm.reset();
          loadProperties();
        } else {
          alert(result.message);
        }
      });
    }
  
    // Load Properties
    const loadProperties = async () => {
      const response = await fetch('http://localhost:5000/api/property', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const properties = await response.json();
  
      propertiesList.innerHTML = '';
      properties.forEach(property => {
        const propertyElement = document.createElement('div');
        propertyElement.className = 'property';
        propertyElement.innerHTML = `
          <h3>${property.title}</h3>
          <p>${property.description}</p>
          <p>Price: $${property.price}</p>
          <p>Address: ${property.address}</p>
          <button data-id="${property._id}" class="interested-btn">I'm Interested</button>
          <button data-id="${property._id}" class="like-btn">Like</button>
        `;
        propertiesList.appendChild(propertyElement);
      });
    }
  
    if (propertiesList) {
      loadProperties();
    }
  });
  