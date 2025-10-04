// Modal functionality
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close-modal');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    alert('Login functionality would be implemented here with proper backend integration.');
    loginModal.style.display = 'none';

    // Store login email and time in localStorage
    localStorage.setItem('loggedInEmail', email);
    localStorage.setItem('loginTime', new Date().toLocaleString());

    // Update login info display
    updateLoginInfoDisplay();
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Registration functionality would be implemented here with proper backend integration.');
    registerModal.style.display = 'none';
});

// Function to update login info display in Settings
function updateLoginInfoDisplay() {
    const email = localStorage.getItem('loggedInEmail') || 'N/A';
    const loginTime = localStorage.getItem('loginTime') || 'N/A';
    const locationElem = document.getElementById('loginLocation');
    const emailElem = document.getElementById('loginUserEmail');
    const timeElem = document.getElementById('loginTime');
    const userInfoCard = document.getElementById('userLoginInfoCard');

    emailElem.textContent = email;
    timeElem.textContent = loginTime;
    userInfoCard.style.display = 'block';

    // Fetch location using IP geolocation API
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            locationElem.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
        })
        .catch(() => {
            locationElem.textContent = 'Unable to fetch location';
        });
}

// Refresh location button handler
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

// On page load, update login info display if available
document.addEventListener('DOMContentLoaded', () => {
    updateLoginInfoDisplay();
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

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookingDate = bookingForm.bookingDate ? bookingForm.bookingDate.value : '';
    alert('Thank you, ' + bookingForm.customerName.value + '! Your booking for a ' + bookingForm.containerType.value + ' container on ' + bookingDate + ' in ' + bookingForm.city.value + '. Contact Number: ' + bookingForm.contactNumber.value + '. We will connect with you soon.');
    bookingModal.style.display = 'none';
    bookingForm.reset();
  });

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
