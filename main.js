document.addEventListener('DOMContentLoaded', () => {

    // Data Produk dan Tutor
    const products = {
        '1': { name: 'Joki Tugas Makalah', price: 75000, discountPrice: 30000, description: 'Solusi cepat dan tepat untuk tugas makalah Anda. Kami jamin makalah Anda akan selesai tepat waktu dengan kualitas terbaik.' },
        '2': { name: 'Joki Tugas Skripsi', price: 120000, discountPrice: 55000, description: 'Bantuan profesional untuk skripsi Anda. Kami bantu mulai dari penulisan bab 1 sampai bab terakhir. Harga menyesuaikan tingkat kesulitan.' },
        '3': { name: 'Joki Tugas Coding', price: 90000, discountPrice: 40000, description: 'Solusi untuk masalah coding. Tim ahli kami siap membantu Anda menyelesaikan tugas-tugas pemrograman yang rumit.' },
        '4': { name: 'Joki Tugas Presentasi', price: 60000, discountPrice: 25000, description: 'Buat presentasi Anda lebih menarik dan profesional. Kami bantu desain slide presentasi yang eye-catching dan informatif.' },
        '5': { name: 'Joki Tugas Presentasi 2', price: 30000, discountPrice: 25000, description: 'Buat presentasi Anda lebih menarik dan profesional. Kami bantu desain slide presentasi yang eye-catching dan informatif.' }
    };

    const tutors = {
        '1': { name: 'Zafina', education: 'S2 Matematika UI', tasks: '150+', description: 'Zafina adalah ahli dalam bidang matematika dan fisika. Dengan pengalaman lebih dari 5 tahun, ia telah membantu ratusan siswa memahami konsep-konsep sulit dan meraih nilai A.' },
        '2': { name: 'Rizal', education: 'S1 Teknik Informatika ITB', tasks: '100+', description: 'Rizal adalah seorang spesialis di bidang desain grafis dan pemrograman. Karyanya dikenal kreatif dan efisien, menjadikannya pilihan utama untuk tugas-tugas berbasis teknologi.' },
        '3': { name: 'Salma', education: 'S2 Sastra Indonesia UGM', tasks: '120+', description: 'Salma adalah pakar dalam sastra dan ilmu sosial. Ia sangat teliti dalam penulisan dan riset, memastikan setiap tugas dikerjakan dengan standar akademik tertinggi.' }
    };

    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartPopup = document.getElementById('cart-popup');
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const subTotalPriceEl = document.getElementById('sub-total-price');
    const discountTotalEl = document.getElementById('discount-total-price');
    const totalPriceEl = document.getElementById('total-price');
    const productList = document.getElementById('product-list');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navbar = document.querySelector('.header .navbar');
    const productDetailPopup = document.getElementById('product-detail-popup');
    const closePopupBtn = document.querySelector('.close-popup-btn');
    const popupProductTitle = document.getElementById('popup-product-title');
    const popupProductDesc = document.getElementById('popup-product-description');
    const popupProductPrice = document.getElementById('popup-product-price');
    const addToCartPopupBtn = document.querySelector('.add-to-cart-popup');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Elemen DOM untuk tutor
    const tutorContainer = document.querySelector('.tutor-container');
    const tutorDetailPopup = document.getElementById('tutor-detail-popup');
    const closePopupBtnTutor = document.querySelector('.close-popup-btn-tutor');
    const popupTutorPhoto = document.getElementById('popup-tutor-photo');
    const popupTutorName = document.getElementById('popup-tutor-name');
    const popupTutorEducation = document.getElementById('popup-tutor-education');
    const popupTutorTasks = document.getElementById('popup-tutor-tasks');
    const popupTutorDesc = document.getElementById('popup-tutor-description');
    
    // Elemen untuk Custom Pop-up
    const customAlert = document.getElementById('custom-alert');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertClose = document.getElementById('custom-alert-close');
    const customConfirm = document.getElementById('custom-confirm');
    const customConfirmMessage = document.getElementById('custom-confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    let confirmCallback = null;

    // Pop-up Pembayaran
    const paymentPopup = document.getElementById('payment-popup');
    const closePaymentPopup = document.getElementById('close-payment-popup');
    const paymentForm = document.getElementById('payment-form');
    
    // Inisialisasi keranjang dari Local Storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    // Fungsi untuk menampilkan custom alert
    function showAlert(message) {
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';
    }

    // Fungsi untuk menampilkan custom confirm
    function showConfirm(message, callback) {
        customConfirmMessage.textContent = message;
        customConfirm.style.display = 'flex';
        confirmCallback = callback;
    }

    // Event listener untuk menutup custom alert
    customAlertClose.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    // Event listener untuk tombol 'Ya' di custom confirm
    confirmYesBtn.addEventListener('click', () => {
        customConfirm.style.display = 'none';
        if (confirmCallback) {
            confirmCallback(true);
        }
    });

    // Event listener untuk tombol 'Tidak' di custom confirm
    confirmNoBtn.addEventListener('click', () => {
        customConfirm.style.display = 'none';
        if (confirmCallback) {
            confirmCallback(false);
        }
    });

    // Fungsi untuk menyimpan keranjang ke Local Storage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Fungsi untuk menghitung total harga
    function calculateTotal() {
        let subTotal = 0;
        let discountTotal = 0;
        cart.forEach(item => {
            subTotal += item.price * item.quantity;
            discountTotal += (item.price - item.discountPrice) * item.quantity;
        });
        return subTotal - discountTotal;
    }

    // Fungsi untuk memperbarui tampilan keranjang
    function updateCartDisplay() {
        cartItemsEl.innerHTML = '';
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#999;">Keranjang kosong.</p>';
            cartCountEl.style.display = 'none';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                const price = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.discountPrice);
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <div class="quantity-control">
                            <span class="quantity-btn decrease-quantity" data-id="${item.id}">-</span>
                            <span class="quantity-display">${item.quantity}</span>
                            <span class="quantity-btn increase-quantity" data-id="${item.id}">+</span>
                        </div>
                    </div>
                    <div class="cart-item-price-quantity">
                        <span class="cart-item-price">${price}</span>
                        <a href="#" class="remove-item" data-id="${item.id}" style="font-size:1.2rem; color: var(--error-color); text-decoration: underline;">Hapus</a>
                    </div>
                `;
                cartItemsEl.appendChild(itemEl);
            });
            cartCountEl.innerText = cart.length;
            cartCountEl.style.display = 'block';
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        }
        
        const subTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountTotal = cart.reduce((total, item) => total + ((item.price - item.discountPrice) * item.quantity), 0);
        const finalTotal = subTotal - discountTotal;
        
        subTotalPriceEl.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subTotal);
        discountTotalEl.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(discountTotal);
        totalPriceEl.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(finalTotal);
    }

    // Event listener untuk tombol "Tambahkan ke Keranjang"
    productList.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            const product = products[productId];
            
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, id: productId, quantity: 1 });
            }
            saveCart();
            updateCartDisplay();
            showAlert('Produk berhasil ditambahkan ke keranjang!');
            
            // Animasi produk masuk keranjang
            const cartIcon = document.getElementById('keranjang');
            const productRect = productCard.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            const flyImg = document.createElement('div');
            flyImg.classList.add('animate-product');
            flyImg.style.top = `${productRect.top}px`;
            flyImg.style.left = `${productRect.left}px`;
            document.body.appendChild(flyImg);
            
            setTimeout(() => {
                flyImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
                flyImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
                flyImg.style.transform = 'translate(-50%, -50%) scale(0)';
                flyImg.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                flyImg.remove();
            }, 1000);
        }
    });

    // Event listener untuk membuka pop-up keranjang
    cartIconContainer.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-popup')) {
            cartPopup.classList.toggle('active');
            if (cartPopup.classList.contains('active')) {
                const iconRect = cartIconContainer.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const popupWidth = cartPopup.offsetWidth;
                let leftPosition = iconRect.left;
                
                if (leftPosition + popupWidth > viewportWidth) {
                    leftPosition = viewportWidth - popupWidth - 20;
                }
                
                cartPopup.style.top = `${iconRect.bottom + 10}px`;
                cartPopup.style.left = `${leftPosition}px`;
                cartPopup.style.right = 'auto';
            }
        }
    });

    // Tutup pop-up keranjang saat klik di luar area pop-up
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-popup') && !e.target.closest('.cart-icon-container')) {
            cartPopup.classList.remove('active');
        }
    });

    // Event listener untuk tombol "Lihat Detail Produk"
    productList.addEventListener('click', (e) => {
        if (e.target.closest('.view-details')) {
            const productId = e.target.closest('.product-card').dataset.productId;
            const product = products[productId];
            
            if (product) {
                popupProductTitle.textContent = product.name;
                popupProductDesc.textContent = product.description;
                const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.discountPrice);
                popupProductPrice.textContent = `Harga: ${formattedPrice}`;
                productDetailPopup.classList.add('active');
                
                addToCartPopupBtn.onclick = () => {
                    const existingItem = cart.find(item => item.id === productId);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({ ...product, id: productId, quantity: 1 });
                    }
                    saveCart();
                    updateCartDisplay();
                    showAlert('Produk berhasil ditambahkan ke keranjang!');
                    productDetailPopup.classList.remove('active');
                };
            }
        }
    });

    // Event listener untuk tombol menutup pop-up detail produk
    closePopupBtn.addEventListener('click', () => {
        productDetailPopup.classList.remove('active');
    });

    // Mengurangi atau menambah kuantitas, atau menghapus item dari keranjang
    cartItemsEl.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('increase-quantity')) {
            const id = target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity++;
                saveCart();
                updateCartDisplay();
            }
        } else if (target.classList.contains('decrease-quantity')) {
            const id = target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                updateCartDisplay();
            } else if (item && item.quantity === 1) {
                showConfirm('Apakah Anda yakin ingin menghapus produk ini?', (isConfirmed) => {
                    if (isConfirmed) {
                        cart = cart.filter(i => i.id !== id);
                        saveCart();
                        updateCartDisplay();
                    }
                });
            }
        } else if (target.classList.contains('remove-item')) {
            e.preventDefault();
            const id = target.dataset.id;
            showConfirm('Apakah Anda yakin ingin menghapus produk ini?', (isConfirmed) => {
                if (isConfirmed) {
                    cart = cart.filter(i => i.id !== id);
                    saveCart();
                    updateCartDisplay();
                }
            });
        }
    });
    
    // --- LOGIKA CHECKOUT BARU UNTUK WHATSAPP ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showAlert('Keranjang belanja Anda kosong.');
            return;
        }

        // Tampilkan pop-up formulir pembayaran
        paymentPopup.style.display = 'flex';
    });

    closePaymentPopup.addEventListener('click', () => {
        paymentPopup.style.display = 'none';
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const tutorSelect = document.getElementById('tutor-select').value;
        const paymentMethodSelect = document.getElementById('payment-method-select').value;

        if (!customerName || !customerPhone || !tutorSelect || !paymentMethodSelect) {
            showAlert('Harap lengkapi semua data sebelum melanjutkan.');
            return;
        }

        const adminNumber = '6285379504992'; // Ganti dengan nomor WhatsApp admin Anda
        const total = calculateTotal();
        const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total);

        let orderSummary = 'Halo admin, saya ingin pesan joki tugas. Berikut detail pesanan saya:\n\n';
        orderSummary += `*Nama Customer:* ${customerName}\n`;
        orderSummary += `*Nomor HP:* ${customerPhone}\n`;
        orderSummary += `*Tutor Pilihan:* ${tutorSelect}\n\n`;
        orderSummary += `*Detail Produk:*\n`;

        cart.forEach(item => {
            const itemTotal = item.discountPrice * item.quantity;
            const formattedItemPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.discountPrice);
            orderSummary += `- ${item.name} (${item.quantity} produk) | Harga: ${formattedItemPrice}\n`;
        });

        orderSummary += `\n*Total Harga:* ${formattedTotal}\n`;
        orderSummary += `*Metode Pembayaran:* ${paymentMethodSelect}\n\n`;
        orderSummary += `Mohon instruksi pembayaran selanjutnya. Terima kasih.`;

        const encodedMessage = encodeURIComponent(orderSummary);
        window.open(`https://wa.me/${adminNumber}?text=${encodedMessage}`, '_blank');
        
        // Opsional: Kosongkan keranjang setelah berhasil checkout
        // cart = [];
        // saveCart();
        // updateCartDisplay();

        paymentPopup.style.display = 'none';
        showAlert('Pesanan Anda berhasil dikirim! Kami akan segera menghubungi Anda di WhatsApp.');
    });

    // Event listener untuk hamburger menu
    hamburgerBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // Tutor functionality
    tutorContainer.addEventListener('click', (e) => {
        if (e.target.closest('.view-tutor-details')) {
            const tutorCard = e.target.closest('.tutor-card');
            const tutorId = tutorCard.dataset.tutorId;
            const tutor = tutors[tutorId];

            if (tutor) {
                popupTutorPhoto.src = `https://via.placeholder.com/300`; // Ganti dengan URL foto tutor yang sesungguhnya
                popupTutorName.textContent = tutor.name;
                popupTutorEducation.textContent = tutor.education;
                popupTutorTasks.textContent = tutor.tasks;
                popupTutorDesc.textContent = tutor.description;
                tutorDetailPopup.classList.add('active');
            }
        }
    });

    closePopupBtnTutor.addEventListener('click', () => {
        tutorDetailPopup.classList.remove('active');
    });

    const selectTutorBtn = document.getElementById('select-tutor-btn');
    selectTutorBtn.addEventListener('click', () => {
        tutorDetailPopup.classList.remove('active');
        showAlert('Tutor telah dipilih. Silakan lanjutkan ke keranjang belanja untuk menyelesaikan pesanan.');
    });
});
