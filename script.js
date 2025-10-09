// Focus trap utility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    element.addEventListener('keydown', handleTab);
    firstElement.focus();

    return () => element.removeEventListener('keydown', handleTab);
}

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close-modal');
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');
let removeTrapLogin, removeTrapRegister;

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

if (loginBtn && loginModal) {
  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    removeTrapLogin = trapFocus(loginModal);
  });
}

if (registerBtn && registerModal) {
  registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
    removeTrapRegister = trapFocus(registerModal);
  });
}

if (closeButtons) {
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (loginModal && loginModal.style.display === 'flex') {
        loginModal.style.display = 'none';
        if (removeTrapLogin) removeTrapLogin();
      }
      if (registerModal && registerModal.style.display === 'flex') {
        registerModal.style.display = 'none';
        if (removeTrapRegister) removeTrapRegister();
      }
    });
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        if (removeTrapLogin) removeTrapLogin();
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
        if (removeTrapRegister) removeTrapRegister();
    }
});

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    console.log("Login form submitted");
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');

    // Validation
    if (!emailInput.value || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        alert('Valid email enter karein');
        emailInput.focus();
        return;
    }
    if (passInput.value.length < 6) {
        alert('Password 6+ chars');
        passInput.focus();
        return;
    }

    // Check if user exists and password matches
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (!Array.isArray(registeredUsers)) {
        registeredUsers = [];
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    const user = registeredUsers.find(u => u.email === emailInput.value);
    if (!user) {
        alert('User not registered. Please register first.');
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
        return;
    }
    if (user.password !== passInput.value) {
        alert('Incorrect password. Please try again.');
        passInput.focus();
        return;
    }

    alert('Login successful!');
    loginModal.style.display = 'none';

    // Store login email and time in localStorage
    localStorage.setItem('loggedInEmail', emailInput.value);
    localStorage.setItem('loginTime', new Date().toLocaleString());

    // Show menu button after successful login
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.style.display = 'flex';
    }

    // Show user name and hide login/register buttons
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        const displayName = user.name;
        userDisplay.innerHTML = `Welcome, ${displayName}<br><button id="logoutBtn" class="btn btn-outline" style="margin-top: 5px; font-size: 0.9rem;">Logout</button>`;
        userDisplay.style.display = 'block';

        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInEmail');
                localStorage.removeItem('loginTime');
                location.reload(); // Reload to reset UI
            });
        }
    }

    // Update login info display
    updateLoginInfoDisplay();
  });
}

if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    console.log("Register form submitted");
    e.preventDefault();
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const phoneInput = document.getElementById('registerPhone');
    const passInput = document.getElementById('registerPassword');
    const confirmPassInput = document.getElementById('registerConfirmPassword');

    // Validation
    if (!nameInput.value.trim()) {
        alert('Full Name is required');
        nameInput.focus();
        return;
    }
    if (!emailInput.value || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        alert('Valid email enter karein');
        emailInput.focus();
        return;
    }
    if (!phoneInput.value.trim()) {
        alert('Phone Number is required');
        phoneInput.focus();
        return;
    }
    if (passInput.value.length < 6) {
        alert('Password must be at least 6 characters');
        passInput.focus();
        return;
    }
    if (passInput.value !== confirmPassInput.value) {
        alert('Passwords do not match');
        confirmPassInput.focus();
        return;
    }

    // Check if user already registered
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (!Array.isArray(registeredUsers)) {
        registeredUsers = [];
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    const userExists = registeredUsers.some(u => u.email === emailInput.value || u.phone === phoneInput.value || u.name.toLowerCase() === nameInput.value.trim().toLowerCase());

    if (userExists) {
        alert('User with this email, phone or name already registered. Please login.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
        return;
    }

    // Register new user
    registeredUsers.push({
        name: nameInput.value.trim(),
        email: emailInput.value,
        phone: phoneInput.value,
        password: passInput.value
    });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful! Please login now.');
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';

    // Hide menu button after registration (before login)
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.style.display = 'none';
    }
  });
}

// Function to update login info display in Settings
function updateLoginInfoDisplay() {
    const email = localStorage.getItem('loggedInEmail') || 'N/A';
    const loginTime = localStorage.getItem('loginTime') || 'N/A';
    const locationElem = document.getElementById('loginLocation');
    const emailElem = document.getElementById('loginUserEmail');
    const timeElem = document.getElementById('loginTime');
    const userInfoCard = document.getElementById('userLoginInfoCard');

    if (emailElem) emailElem.textContent = email;
    if (timeElem) timeElem.textContent = loginTime;
    if (userInfoCard) userInfoCard.style.display = 'block';

    // Fetch location using IP geolocation API
    if (locationElem) {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                locationElem.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
            })
            .catch(() => {
                locationElem.textContent = 'Unable to fetch location';
            });
    }
}

// Refresh location button handler
if (document.getElementById('refreshLocationBtn')) {
  document.getElementById('refreshLocationBtn').addEventListener('click', () => {
      const locationElem = document.getElementById('loginLocation');
      locationElem.textContent = 'Fetching...';
      fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
              locationElem.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
          })
          .catch(() => {
              locationElem.textContent = 'Unable to fetch location';
          });
  });
}

// On page load, update login info display if available
document.addEventListener('DOMContentLoaded', () => {
    updateLoginInfoDisplay();

    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('nav');
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    if (hamburger && nav) {
        if (loggedInEmail) {
            hamburger.style.display = 'flex';
        } else {
            hamburger.style.display = 'none';
            nav.classList.remove('active');
        }
    }

    // Hide register button if any user is registered
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (!Array.isArray(registeredUsers)) {
        registeredUsers = [];
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    if (registeredUsers.length > 0) {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.style.display = 'none';
        }
    }

    // Show logged in user name and hide login/register buttons
    const userDisplay = document.getElementById('userDisplay');
    if (loggedInEmail && userDisplay) {
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (!Array.isArray(registeredUsers)) {
            registeredUsers = [];
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        const user = registeredUsers.find(u => u.email === loggedInEmail);
        const displayName = user ? user.name : loggedInEmail;
        userDisplay.innerHTML = `Welcome, ${displayName}<br><button id="logoutBtn" class="btn btn-outline" style="margin-top: 5px; font-size: 0.9rem;">Logout</button>`;
        userDisplay.style.display = 'block';

        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInEmail');
                localStorage.removeItem('loginTime');
                location.reload(); // Reload to reset UI
            });
        }
    }

    // Add event listeners to menu links to check login status
    const menuLinks = document.querySelectorAll('nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const loggedInEmail = localStorage.getItem('loggedInEmail');
            if (!loggedInEmail) {
                e.preventDefault();
                alert('Please register and login first to access this feature.');
                const registerModal = document.getElementById('registerModal');
                if (registerModal) {
                    registerModal.style.display = 'flex';
                }
                return false;
            }
        });
    });
});

// BillBook functionality
function generateInvoice() {
    const transporterName = document.getElementById('transporterName').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const fromLocation = document.getElementById('fromLocation').value;
    const toLocation = document.getElementById('toLocation').value;
    const goodsDescription = document.getElementById('goodsDescription').value;
    const weight = document.getElementById('weight').value;
    const freightCharges = parseFloat(document.getElementById('freightCharges').value) || 0;
    const advancePaid = parseFloat(document.getElementById('advancePaid').value) || 0;

    // Calculate balance
    const balance = freightCharges - advancePaid;

    // Update invoice preview
    document.getElementById('invoiceTransporter').textContent = transporterName || 'Transporter Name';
    document.getElementById('invoiceVehicle').textContent = vehicleNumber || 'Vehicle Number';
    document.getElementById('invoiceRoute').textContent = `${fromLocation || 'From'} - ${toLocation || 'To'}`;
    document.getElementById('invoiceGoods').textContent = goodsDescription || 'Goods Description';
    document.getElementById('invoiceWeight').textContent = `Weight: ${weight || 0} kg`;
    document.getElementById('invoiceFreight').textContent = freightCharges.toFixed(2);
    document.getElementById('invoiceAdvance').textContent = advancePaid.toFixed(2);
    document.getElementById('invoiceBalance').textContent = balance.toFixed(2);
    document.getElementById('invoiceTotal').textContent = balance.toFixed(2);

    // Generate invoice number
    const invoiceNumber = 'TR-' + Date.now().toString().slice(-6);
    document.getElementById('invoiceNumber').textContent = invoiceNumber;

    // Set current date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB');
    document.getElementById('invoiceDate').textContent = dateStr;

    // Show invoice preview
    document.getElementById('invoicePreview').style.display = 'block';
}

function printInvoice() {
    window.print();
}

function saveInvoice() {
    alert('Invoice saved successfully!');
}

function closeInvoice() {
    document.getElementById('invoicePreview').style.display = 'none';
}

// Simple animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and container cards
document.querySelectorAll('.service-card, .container-card, .branch-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

/* Show About section always and initialize Swiper sliders */
  document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.style.display = 'block';
    }

    // Set min and max date for bookingDate input (today to next 10 days)
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const minDate = `${yyyy}-${mm}-${dd}`;
      bookingDateInput.min = minDate;

      const maxDateObj = new Date(today);
      maxDateObj.setDate(maxDateObj.getDate() + 10);
      const maxYyyy = maxDateObj.getFullYear();
      const maxMm = String(maxDateObj.getMonth() + 1).padStart(2, '0');
      const maxDd = String(maxDateObj.getDate()).padStart(2, '0');
      const maxDate = `${maxYyyy}-${maxMm}-${maxDd}`;
      bookingDateInput.max = maxDate;

      // Set default value to today
      bookingDateInput.value = minDate;
    }

  // Initialize Swiper for testimonials
  if (document.querySelector('.swiper')) {
    const swiperTestimonials = new Swiper('.swiper', {
      slidesPerView: 3,
      spaceBetween: 50,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      },
    });
  }

  // Initialize Swiper for partners slider
  const swiperPartners = new Swiper('.partners-slider .partners-container', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    direction: 'horizontal',
  });

  // Fix for getComputedStyle error: ensure element exists before calling getComputedStyle
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function(element, pseudoElt) {
    if (!(element instanceof Element)) {
      return null;
    }
    return originalGetComputedStyle.call(window, element, pseudoElt);
  };

  // Booking modal functionality
  const bookNowBtn = document.getElementById('bookNowBtn');
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const closeModalButtons = document.querySelectorAll('.close-modal');

  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      bookingModal.style.display = 'flex';
    });
  }

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      bookingModal.style.display = 'none';
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bookingDate = bookingForm.bookingDate ? bookingForm.bookingDate.value : '';

      // Create booking object
      const booking = {
        customerName: bookingForm.customerName.value,
        containerType: bookingForm.containerType.value,
        bookingDate: bookingDate,
        city: bookingForm.city.value,
        address: bookingForm.address.value,
        itemsWeight: bookingForm.itemsWeight.value,
        weightUnit: bookingForm.weightUnit.value,
        contactNumber: bookingForm.contactNumber.value,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      alert('Thank you, ' + bookingForm.customerName.value + '! Your booking for a ' + bookingForm.containerType.value + ' container on ' + bookingDate + ' in ' + bookingForm.city.value + '. Contact Number: ' + bookingForm.contactNumber.value + '. We will connect with you soon.');
      if (bookingModal) bookingModal.style.display = 'none';
      bookingForm.reset();
    });
  }

  // Remove current date and time display inside Book Now button
  const currentDateBtnElem = document.getElementById('currentDate');
  const currentTimeElem = document.getElementById('currentTime');
  if (currentDateBtnElem) {
    currentDateBtnElem.remove();
  }
  if (currentTimeElem) {
    currentTimeElem.remove();
  }

  // Show current date in the date section
  const currentDateElem = document.getElementById('currentDate');
  if (currentDateElem) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const now = new Date();
    currentDateElem.textContent = now.toLocaleDateString(undefined, options);
  }
});
