// ===== Global Functions =====

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Item added to cart!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('span').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartGst = document.getElementById('cart-gst');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
        cartSubtotal.textContent = '₹0.00';
        cartGst.textContent = '₹0.00';
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartGst.textContent = `₹${gst.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item.quantity > 1) {
                item.quantity--;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            const newQuantity = parseInt(this.value) || 1;
            if (newQuantity >= 1) {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            }
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        });
    });
}

// ===== Events Page Functions =====
function initEventsPage() {
    const events = [
        {
            id: 1,
            title: "Mumbai Pet Fest",
            date: "2023-06-15",
            location: "Bandra Kurla Complex, Mumbai",
            city: "mumbai",
            type: "competition",
            description: "Annual pet festival with competitions, stalls, and adoption drive.",
            image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
            id: 2,
            title: "Delhi Pet Adoption Day",
            date: "2023-06-18",
            location: "Nehru Park, Delhi",
            city: "delhi",
            type: "adoption",
            description: "Over 200 pets looking for homes! Dogs, cats, and more.",
            image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
            id: 3,
            title: "Bangalore Dog Training",
            date: "2023-06-22",
            location: "Cubbon Park, Bangalore",
            city: "bangalore",
            type: "workshop",
            description: "Basic obedience and agility workshop for dogs.",
            image: "https://images.unsplash.com/photo-1559131397-f94da358a7d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
            id: 4,
            title: "Hyderabad Pet Carnival",
            date: "2023-06-25",
            location: "Hitex Exhibition Center",
            city: "hyderabad",
            type: "competition",
            description: "Costume contest, pet talent show, and vendor stalls.",
            image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        }
    ];

    const eventContainer = document.getElementById('events-container');
    const searchBtn = document.getElementById('search-btn');
    const eventTypeFilter = document.getElementById('event-type');
    const locFilter = document.getElementById('location');
    const dateFilter = document.getElementById('date');
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');

    if (eventContainer) {
        displayEvents(events);

        if (searchBtn) {
            searchBtn.addEventListener('click', () => filterEvents(events));
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                bookingModal.classList.remove('active');
            });
        }
    }

    function filterEvents(events) {
        const selectedType = eventTypeFilter.value;
        const selectedCity = locFilter.value;
        const selectedDate = dateFilter.value;
        
        let filteredEvents = events;

        if (selectedType !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === selectedType);
        }

        if (selectedCity !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.city === selectedCity);
        }
        
        if (selectedDate) {
            filteredEvents = filteredEvents.filter(event => event.date === selectedDate);
        }
        
        displayEvents(filteredEvents);
    }

    function displayEvents(eventsToDisplay) {
        if (eventsToDisplay.length === 0) {
            eventContainer.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Events Found</h3>
                    <p>We couldn't find any events matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        eventContainer.innerHTML = eventsToDisplay.map(e => `
            <div class="event-card" data-id="${e.id}">
                <div class="event-image">
                    <img src="${e.image}" alt="${e.title}">
                </div>
                <div class="event-content">
                    <span class="event-date">${formatDate(e.date)}</span>
                    <h3 class="event-title">${e.title}</h3>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i> ${e.location}
                    </div>
                    <p class="event-description">${e.description}</p>
                    <div class="event-actions">
                        <button class="btn book-btn">Book Now</button>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventCard = this.closest('.event-card');
                const eventId = parseInt(eventCard.dataset.id);
                const eventTitle = eventCard.querySelector('.event-title').textContent;
                showBookingForm(eventId, eventTitle, events);
            });
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function showBookingForm(eventId, eventTitle, events) {
        modalBody.innerHTML = `
            <h2>Book Your Seat</h2>
            <p class="text-center">${eventTitle}</p>
            <form id="booking-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label for="pet-type">Pet Type</label>
                    <select id="pet-type" name="pet-type" required>
                        <option value="">Select Pet Type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pet-name">Pet Name</label>
                    <input type="text" id="pet-name" name="pet-name" required placeholder="Enter your pet's name">
                </div>
                <div class="form-submit">
                    <button type="submit" class="btn">Confirm Booking</button>
                </div>
            </form>
            <div id="booking-status"></div>
        `;
        
        bookingModal.classList.add('active');

        const form = document.getElementById('booking-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                petType: formData.get('pet-type'),
                petName: formData.get('pet-name')
            };
            
            const statusDiv = document.getElementById('booking-status');
            statusDiv.innerHTML = '<div class="status-message">Processing your booking...</div>';
            
            setTimeout(() => {
                const bookingRef = 'BK-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                const event = events.find(e => e.id === eventId);
                
                statusDiv.innerHTML = '';
                modalBody.innerHTML = `
                    <h2>Booking Confirmed!</h2>
                    <div class="success status-message">
                        <p>Your booking has been confirmed!</p>
                        <p>Reference: <strong>${bookingRef}</strong></p>
                    </div>
                    <div class="ticket-actions">
                        <button class="ticket-btn close-modal">Close</button>
                    </div>
                `;

                document.querySelector('.close-modal').addEventListener('click', () => {
                    bookingModal.classList.remove('active');
                });
            }, 1500);
        });
    }
}

// ===== Products Page Functions =====
function initProductsPage() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const petFilterButtons = document.querySelectorAll('.pet-filter-btn');
    const searchInput = document.getElementById('searchInput');
    
    let currentPetFilter = 'all';
    let searchTerm = '';

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            document.querySelectorAll('.category-content').forEach(content => {
                content.classList.remove('active-category');
            });
        
            document.getElementById(selectedCategory)?.classList.add('active-category');
            
            if (searchInput) searchInput.value = '';
            searchTerm = '';
            filterProducts();
        });
    });

    petFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            petFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentPetFilter = this.getAttribute('data-pet');
            filterProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase();
            filterProducts();
        });
    }

    function filterProducts() {
        const activeCategory = document.querySelector('.category-content.active-category');
        
        if (activeCategory) {
            activeCategory.querySelectorAll('.product-card').forEach(card => {
                const productName = card.querySelector('.product-title').textContent.toLowerCase();
                const petType = card.getAttribute('data-pet');
                const matchesSearch = searchTerm === '' || productName.includes(searchTerm);
                const matchesPetFilter = currentPetFilter === 'all' || petType === currentPetFilter || petType === 'all';
                
                card.style.display = (matchesSearch && matchesPetFilter) ? 'block' : 'none';
            });
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.getAttribute('data-id'),
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace('₹', '')),
                image: productCard.querySelector('.product-image img').src
            };
            
            addToCart(product);
        });
    });
}

// ===== Profile Page Functions =====
function initProfilePage() {
    class PetDatabase {
        constructor() {
            if (!localStorage.getItem('petProfile')) {
                const defaultProfile = {
                    name: "Max",
                    breed: "Golden Retriever",
                    age: "2 years",
                    gender: "Female",
                    weight: "18",
                    microchip: "985612345678",
                    owner: "Neha Sharma",
                    photo: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    lastCheckup: "15 May 2023"
                };
                localStorage.setItem('petProfile', JSON.stringify(defaultProfile));
            }
            
            if (!localStorage.getItem('medicalrecords')) {
                const defaultRecords = [
                    {
                        id: Date.now() - 1000,
                        date: '15/05/2023',
                        type: 'Vaccination',
                        description: 'Rabies vaccine (booster)',
                        vet: 'Dr. Priyanka Patel',
                        document: '#'
                    }
                ];
                localStorage.setItem('medicalrecords', JSON.stringify(defaultRecords));
            }
        }
        
        getProfile() {
            return JSON.parse(localStorage.getItem('petProfile'));
        }
        
        saveProfile(profile) {
            localStorage.setItem('petProfile', JSON.stringify(profile));
        }
        
        getMedicalRecords() {
            return JSON.parse(localStorage.getItem('medicalrecords')) || [];
        }

        saveMedicalRecords(records) {
            localStorage.setItem('medicalrecords', JSON.stringify(records));
        }
        
        addMedicalRecord(record) {
            const records = this.getMedicalRecords();
            record.id = Date.now();
            records.unshift(record);
            this.saveMedicalRecords(records);
            return record;
        }
        
        deleteMedicalRecord(id) {
            const records = this.getMedicalRecords();
            const newRecords = records.filter(r => r.id !== id);
            this.saveMedicalRecords(newRecords);
            return newRecords.length !== records.length;
        }
        
        getMedicalRecordById(id) {
            const records = this.getMedicalRecords();
            return records.find(r => r.id === id);
        }
    }

    const db = new PetDatabase();

    const editProfileBtn = document.getElementById('edit-profile-btn');
    const addMedicalBtn = document.getElementById('add-medical-btn');
    const editProfileModal = document.getElementById('editProfileModal');
    const medicalRecordModal = document.getElementById('medicalRecordModal');
    const closeEditModal = editProfileModal?.querySelector('.close-btn');
    const closeMedicalModal = medicalRecordModal?.querySelector('.close-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const cancelMedicalBtn = document.getElementById('cancel-medical');
    const editProfileForm = document.getElementById('editProfileForm');
    const medicalRecordForm = document.getElementById('medicalRecordForm');
    const loadingOverlay = document.getElementById('loading-overlay');
    const medicalModalTitle = document.getElementById('medical-modal-title');
    const recordIdInput = document.getElementById('record-id');

    function showLoading() {
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }

    function showNotification(message, type) {
        alert(message); // Simple alert for demo
    }

    function loadProfile() {
        const petInfo = db.getProfile();
        document.getElementById('pet-name').textContent = petInfo.name;
        document.getElementById('pet-breed').textContent = petInfo.breed;
        document.getElementById('pet-age').textContent = petInfo.age;
        document.getElementById('pet-gender').textContent = petInfo.gender;
        document.getElementById('pet-weight').textContent = `${petInfo.weight} kg`;
        document.getElementById('pet-chip').textContent = petInfo.microchip;
        document.getElementById('pet-owner').textContent = petInfo.owner;
        document.getElementById('last-checkup').textContent = petInfo.lastCheckup;
        document.getElementById('pet-photo').src = petInfo.photo;
    }

    function renderMedicalRecords() {
        const tbody = document.getElementById('medical-history');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const records = db.getMedicalRecords();
        
        if (records.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        <p>No medical records found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        records.forEach(record => {
            const row = document.createElement('tr');
            row.dataset.id = record.id;
            
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.type}</td>
                <td>${record.description}</td>
                <td>${record.vet}</td>
                <td>
                    ${record.document ? 
                        `<a href="${record.document}" class="document-link" target="_blank">
                            <i class="fas fa-file-pdf"></i> View
                        </a>` : 
                        'No document'}
                </td>
                <td>
                    <button class="action-btn edit-medical" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-medical" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const petInfo = db.getProfile();
            
            document.getElementById('edit-name').value = petInfo.name;
            document.getElementById('edit-breed').value = petInfo.breed;
            document.getElementById('edit-age').value = petInfo.age;
            document.getElementById('edit-gender').value = petInfo.gender;
            document.getElementById('edit-weight').value = petInfo.weight;
            document.getElementById('edit-chip').value = petInfo.microchip;
            document.getElementById('edit-owner').value = petInfo.owner;
            document.getElementById('edit-photo').value = petInfo.photo;
            
            editProfileModal.style.display = 'block';
        });
    }

    if (addMedicalBtn) {
        addMedicalBtn.addEventListener('click', function() {
            medicalModalTitle.textContent = 'Add Medical Record';
            recordIdInput.value = '';
            
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('record-date').value = formattedDate;
            
            medicalRecordForm.reset();
            medicalRecordModal.style.display = 'block';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-medical')) {
            const row = e.target.closest('tr');
            const recordId = parseInt(row.dataset.id);
            
            if (confirm('Are you sure you want to delete this record?')) {
                if (db.deleteMedicalRecord(recordId)) {
                    renderMedicalRecords();
                    showNotification('Record deleted successfully!', 'success');
                }
            }
        }
    });

    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => editProfileModal.style.display = 'none');
    }

    if (closeMedicalModal) {
        closeMedicalModal.addEventListener('click', () => medicalRecordModal.style.display = 'none');
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => editProfileModal.style.display = 'none');
    }

    if (cancelMedicalBtn) {
        cancelMedicalBtn.addEventListener('click', () => medicalRecordModal.style.display = 'none');
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updatedProfile = {
                name: document.getElementById('edit-name').value,
                breed: document.getElementById('edit-breed').value,
                age: document.getElementById('edit-age').value,
                gender: document.getElementById('edit-gender').value,
                weight: document.getElementById('edit-weight').value,
                microchip: document.getElementById('edit-chip').value,
                owner: document.getElementById('edit-owner').value,
                photo: document.getElementById('edit-photo').value || db.getProfile().photo,
                lastCheckup: db.getProfile().lastCheckup
            };
            
            db.saveProfile(updatedProfile);
            loadProfile();
            editProfileModal.style.display = 'none';
            showNotification('Profile updated successfully!', 'success');
        });
    }

    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recordDate = document.getElementById('record-date').value;
            const [year, month, day] = recordDate.split('-');
            const displayDate = `${day}/${month}/${year}`;
            const recordType = document.getElementById('record-type').value;
            const description = document.getElementById('record-description').value;
            const vet = document.getElementById('record-vet').value;
            const docUrl = document.getElementById('record-document').value || null;
            
            const recordData = {
                date: displayDate,
                type: recordType,
                description: description,
                vet: vet,
                document: docUrl
            };
            
            db.addMedicalRecord(recordData);
            
            if (recordType === 'Checkup') {
                const profile = db.getProfile();
                profile.lastCheckup = displayDate;
                db.saveProfile(profile);
                document.getElementById('last-checkup').textContent = displayDate;
            }
            
            renderMedicalRecords();
            medicalRecordModal.style.display = 'none';
            showNotification('Medical record added successfully!', 'success');
        });
    }

    loadProfile();
    renderMedicalRecords();
}

// ===== Service Page Functions =====
function initServicePage() {
    const bookingModal = document.getElementById('bookingModal');
    const serviceSelect = document.getElementById('service');
    const bookingForm = document.getElementById('bookingForm');

    window.bookingmodal = function(serviceType) {
        if (serviceSelect) serviceSelect.value = serviceType;
        if (bookingModal && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(bookingModal);
            modal.show();
        }
    };

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            alert("Thank you for your booking request! We'll contact you shortly.");
            bookingForm.reset();
            
            if (typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(bookingModal);
                if (modal) modal.hide();
            }
        });
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    
    // Cart modal
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.getElementById('close-modal');
    const continueShopping = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout');
    
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function() {
            renderCartItems();
            cartModal.style.display = 'flex';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    if (continueShopping) {
        continueShopping.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your order!');
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            cartModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Initialize page-specific functions
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'event.html') {
        initEventsPage();
    } else if (currentPage === 'product.html') {
        initProductsPage();
    } else if (currentPage === 'profile.html') {
        initProfilePage();
    } else if (currentPage === 'service.html') {
        initServicePage();
    }
});