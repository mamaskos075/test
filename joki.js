document.addEventListener('DOMContentLoaded', function () {
    // === Konfigurasi Firebase ===
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "https://review-maskos-default-rtdb.asia-southeast1.firebasedatabase.app/",
        projectId: "review-maskos-default-rtdb",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const database = firebase.database();
    const reviewsRef = database.ref('reviews');

    // === Deklarasi Variabel & Elemen DOM ===
    let navbar = document.querySelector('.navbar');
    let hamburgerBtn = document.querySelector('#hamburger-btn');
    let keranjangIcon = document.getElementById('keranjang');
    let cartPopup = document.getElementById('cart-popup');
    let cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');

    const subTotalPriceElement = document.getElementById('sub-total-price');
    const discountTotalPriceElement = document.getElementById('discount-total-price');
    const totalPriceElement = document.getElementById('total-price');

    const productDetailPopup = document.getElementById('product-detail-popup');
    const closePopupBtn = document.querySelector('.close-popup-btn');
    const popupProductTitle = document.getElementById('popup-product-title');
    const popupProductDescription = document.getElementById('popup-product-description');
    const popupProductPrice = document.getElementById('popup-product-price');
    const addToCartPopupBtn = document.querySelector('.add-to-cart-popup');

    const tutorDetailPopup = document.getElementById('tutor-detail-popup');
    const closeTutorPopupBtn = document.querySelector('.close-popup-btn-tutor');
    const popupTutorPhoto = document.getElementById('popup-tutor-photo');
    const popupTutorName = document.getElementById('popup-tutor-name');
    const popupTutorEducation = document.getElementById('popup-tutor-education');
    const popupTutorTasks = document.getElementById('popup-tutor-tasks');
    const popupTutorDescription = document.getElementById('popup-tutor-description');
    const selectTutorBtn = document.getElementById('select-tutor-btn');

    let closeCartBtn = document.createElement('i');
    closeCartBtn.classList.add('fas', 'fa-times', 'close-cart-btn');
    if (document.querySelector('.cart-header')) {
        document.querySelector('.cart-header').appendChild(closeCartBtn);
    }

    let cart = [];

    // --- DATA TUTOR ---
    const tutorsData = {
        '1': {
            name: 'Zafina',
            education: 'Sarjana Teknik Informatika, Universitas Indonesia',
            tasksCompleted: '350+',
            description: 'Zafina adalah tutor yang sangat detail dan berdedikasi tinggi. Dengan pengalaman lebih dari 5 tahun di bidang IT, ia jago dalam membantu mahasiswa di mata kuliah pemrograman, algoritma, dan struktur data.',
            photo: 'https://via.placeholder.com/300'
        },
        '2': {
            name: 'Rizal',
            education: 'Mahasiswa Desain Komunikasi Visual, ITB',
            tasksCompleted: '210+',
            description: 'Rizal adalah seorang seniman digital yang berbakat. Ia fokus pada tugas-tugas desain grafis, ilustrasi, dan pembuatan presentasi yang memukau. Kliennya selalu puas dengan hasil karyanya yang kreatif.',
            photo: 'https://via.placeholder.com/300'
        },
        '3': {
            name: 'Salma',
            education: 'Sarjana Sastra Inggris, Universitas Gadjah Mada',
            tasksCompleted: '480+',
            description: 'Salma adalah ahli dalam bidang penulisan, riset, dan analisis. Ia sangat cocok untuk membantu tugas-tugas esai, makalah ilmiah, dan tugas-tugas yang membutuhkan kemampuan menulis tingkat tinggi.',
            photo: 'https://via.placeholder.com/300'
        }
    };

    // --- Elemen Ulasan ---
    const reviewFormContainer = document.querySelector('.review-form-container');
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.getElementById('rating-stars');
    const reviewsList = document.getElementById('reviews-list');
    const customAlert = document.getElementById('custom-alert');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close');
    const customConfirm = document.getElementById('custom-confirm');
    const customConfirmMessage = document.getElementById('custom-confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    const invalidLinkMessage = document.getElementById('invalid-link-message');
    let currentRating = 0;

    // === FUNGSI & EVENT LISTENERS ===

    // --- Fungsi Notifikasi & Konfirmasi Kustom ---
    function showAlert(message) {
        if (!customAlert || !customAlertMessage) return;
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';
        setTimeout(() => {
            customAlert.style.display = 'none';
        }, 3000);
    }
    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', () => {
            customAlert.style.display = 'none';
        });
    }
    function showConfirm(message) {
        return new Promise((resolve) => {
            if (!customConfirm || !customConfirmMessage || !confirmYesBtn || !confirmNoBtn) {
                return resolve(window.confirm(message));
            }
            customConfirmMessage.textContent = message;
            customConfirm.style.display = 'flex';
            const onConfirm = () => {
                customConfirm.style.display = 'none';
                confirmYesBtn.removeEventListener('click', onConfirm);
                confirmNoBtn.removeEventListener('click', onCancel);
                resolve(true);
            };
            const onCancel = () => {
                customConfirm.style.display = 'none';
                confirmYesBtn.removeEventListener('click', onConfirm);
                confirmNoBtn.removeEventListener('click', onCancel);
                resolve(false);
            };
            confirmYesBtn.addEventListener('click', onConfirm);
            confirmNoBtn.addEventListener('click', onCancel);
        });
    }

    // Mendapatkan URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const uniqueId = urlParams.get('id');
    const reviewSection = document.getElementById('review');

    // === Logika Utama untuk Tampilan Formulir dan Pesan ===
    if (uniqueId) {
        if (reviewFormContainer) reviewFormContainer.style.display = 'block';
        if (invalidLinkMessage) invalidLinkMessage.style.display = 'none';

        reviewsRef.orderByChild('uniqueId').equalTo(uniqueId).once('value', async (snapshot) => {
            if (snapshot.exists()) {
                const userReview = Object.values(snapshot.val())[0];
                const userReviewKey = Object.keys(snapshot.val())[0];
                const confirmed = await showConfirm('Anda sudah memberikan ulasan sebelumnya. Apakah Anda ingin mengubah ulasan Anda?');

                if (confirmed) {
                    if (reviewFormContainer) reviewFormContainer.style.display = 'block';
                    if (reviewForm) {
                        document.getElementById('review-name').value = userReview.name;
                        document.getElementById('review-phone').value = userReview.phone;
                        document.getElementById('review-text').value = userReview.text;
                        currentRating = userReview.rating;
                        ratingStars.querySelectorAll('i').forEach(star => {
                            if (parseInt(star.dataset.rating) <= currentRating) {
                                star.classList.remove('far');
                                star.classList.add('fas');
                            } else {
                                star.classList.remove('fas');
                                star.classList.add('far');
                            }
                        });
                        reviewsRef.child(userReviewKey).remove();
                    }
                } else {
                    if (reviewFormContainer) reviewFormContainer.style.display = 'none';
                    if (invalidLinkMessage) {
                        invalidLinkMessage.innerHTML = `
                            <h2 class="section-title">Ulasan Sudah Terkirim</h2>
                            <p class="section-description">Terima kasih atas ulasan Anda. Jika ada kendala, silakan hubungi admin.</p>
                            <a href="https://wa.me/NOMOR_HP_ANDA?text=Halo%20admin%20Maskos,%20saya%20ingin%20mengubah%20ulasan%20saya." target="_blank" class="whatsapp-btn">
                                <i class="fab fa-whatsapp"></i> Hubungi Admin
                            </a>
                        `;
                        invalidLinkMessage.style.display = 'block';
                    }
                }
            } else {
                if (reviewFormContainer) reviewFormContainer.style.display = 'block';
            }
            if (reviewSection) {
                reviewSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    } else {
        if (reviewFormContainer) reviewFormContainer.style.display = 'none';
        if (invalidLinkMessage) invalidLinkMessage.style.display = 'block';
    }


    // --- Logika Utama untuk Menampilkan Ulasan Publik ---
    function displayReviews(reviewsData) {
        if (!reviewsList) return;
        reviewsList.innerHTML = '';
        const reviewsArray = Object.keys(reviewsData || {}).map(key => ({
            ...reviewsData[key],
            key
        }));

        if (reviewsArray.length === 0) {
            reviewsList.innerHTML = `<p style="text-align: center; color: #999; font-size: 1.4rem; min-width: 100%;">Belum ada ulasan. Jadilah yang pertama!</p>`;
        } else {
            reviewsArray.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                reviewItem.dataset.phone = review.phone;
                reviewItem.dataset.key = review.key;
                reviewItem.dataset.uniqueId = review.uniqueId;

                const starIcons = '<i class="fas fa-star"></i>'.repeat(review.rating) + '<i class="far fa-star"></i>'.repeat(5 - review.rating);

                reviewItem.innerHTML = `
                    <div class="review-header">
                        <span class="reviewer-info">${review.name}</span>
                        <div class="review-rating">${starIcons}</div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <div class="review-actions" style="display: none;">
                        <button class="edit-review-btn">Edit</button>
                        <button class="delete-review-btn">Hapus</button>
                    </div>
                `;
                reviewsList.appendChild(reviewItem);
            });
        }
    }

    reviewsRef.on('value', (snapshot) => {
        const reviewsData = snapshot.val();
        displayReviews(reviewsData);
    });

    if (ratingStars) {
        ratingStars.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'I') {
                currentRating = parseInt(target.dataset.rating);
                ratingStars.querySelectorAll('i').forEach(star => {
                    if (parseInt(star.dataset.rating) <= currentRating) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('review-name').value;
            const phone = document.getElementById('review-phone').value;
            const text = document.getElementById('review-text').value;

            if (currentRating === 0) {
                showAlert('Mohon berikan rating bintang!');
                return;
            }

            const reviewData = {
                name,
                phone,
                rating: currentRating,
                text,
                date: new Date().toISOString(),
                uniqueId: uniqueId
            };

            reviewsRef.push(reviewData, (error) => {
                if (error) {
                    showAlert('Gagal mengirim ulasan: ' + error.message);
                } else {
                    reviewForm.reset();
                    currentRating = 0;
                    ratingStars.querySelectorAll('i').forEach(star => {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    });
                    showAlert('Ulasan Anda berhasil dikirim!');
                    if (reviewFormContainer) reviewFormContainer.style.display = 'none';
                    if (invalidLinkMessage) {
                        invalidLinkMessage.innerHTML = `
                            <h2 class="section-title">Ulasan Sudah Terkirim</h2>
                            <p class="section-description">Terima kasih atas ulasan Anda. Jika ada kendala, silakan hubungi admin.</p>
                            <a href="https://wa.me/NOMOR_HP_ANDA?text=Halo%20admin%20Maskos,%20saya%20ingin%20mengubah%20ulasan%20saya." target="_blank" class="whatsapp-btn">
                                <i class="fab fa-whatsapp"></i> Hubungi Admin
                            </a>
                        `;
                        invalidLinkMessage.style.display = 'block';
                    }
                }
            });
        });
    }

    // --- LOGIKA EDIT & HAPUS ULASAN ---
    if (reviewsList) {
        reviewsList.addEventListener('click', async (event) => {
            const target = event.target;
            const reviewItem = target.closest('.review-item');
            if (!reviewItem) return;

            const reviewKey = reviewItem.dataset.key;
            const reviewPhone = reviewItem.dataset.phone;
            const reviewUniqueId = reviewItem.dataset.uniqueId;

            if (uniqueId && uniqueId === reviewUniqueId) {
                const loggedInPhone = prompt('Untuk mengelola ulasan, masukkan Nomor HP Anda:');
                if (loggedInPhone === reviewPhone) {
                    if (target.classList.contains('delete-review-btn')) {
                        const confirmed = await showConfirm('Apakah Anda yakin ingin menghapus ulasan ini?');
                        if (confirmed) {
                            reviewsRef.child(reviewKey).remove();
                            showAlert('Ulasan berhasil dihapus.');
                        }
                    } else if (target.classList.contains('edit-review-btn')) {
                        reviewsRef.child(reviewKey).once('value', snapshot => {
                            const reviewToEdit = snapshot.val();
                            if (reviewToEdit) {
                                document.getElementById('review-name').value = reviewToEdit.name;
                                document.getElementById('review-phone').value = reviewToEdit.phone;
                                document.getElementById('review-text').value = reviewToEdit.text;
                                currentRating = reviewToEdit.rating;
                                ratingStars.querySelectorAll('i').forEach(star => {
                                    if (parseInt(star.dataset.rating) <= currentRating) {
                                        star.classList.remove('far');
                                        star.classList.add('fas');
                                    } else {
                                        star.classList.remove('fas');
                                        star.classList.add('far');
                                    }
                                });
                                reviewsRef.child(reviewKey).remove();
                                showAlert('Sekarang Anda dapat mengedit ulasan di formulir.');
                            }
                        });
                    }
                } else {
                    showAlert('Nomor HP tidak cocok. Anda tidak memiliki izin untuk mengelola ulasan ini.');
                }
            } else {
                showAlert('Anda tidak memiliki izin untuk mengelola ulasan ini.');
            }
        });
        reviewsList.addEventListener('mouseover', (event) => {
            const reviewItem = event.target.closest('.review-item');
            if (reviewItem && uniqueId && uniqueId === reviewItem.dataset.uniqueId) {
                const actions = reviewItem.querySelector('.review-actions');
                if (actions) {
                    actions.style.display = 'block';
                }
            }
        });
        reviewsList.addEventListener('mouseout', (event) => {
            const reviewItem = event.target.closest('.review-item');
            if (reviewItem) {
                const actions = reviewItem.querySelector('.review-actions');
                if (actions) {
                    actions.style.display = 'none';
                }
            }
        });
    }

    // --- FUNGSI BANTUAN KERANJANG ---
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (totalItems > 0) {
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.style.display = 'block';
            }
        } else {
            if (cartCount) {
                cartCount.textContent = '0';
                cartCount.style.display = 'none';
            }
        }
    }

    function formatCurrency(amount) {
        return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }

    function setPopupPosition() {
        if (!keranjangIcon || !cartPopup) return;
        const iconRect = keranjangIcon.getBoundingClientRect();
        const popupWidth = cartPopup.offsetWidth;

        let leftPos = iconRect.right - popupWidth;

        if (leftPos < 10) {
            leftPos = 10;
        }

        cartPopup.style.left = `${leftPos}px`;
        cartPopup.style.top = `${iconRect.bottom + 10}px`;
    }

    function displayCartItems() {
        if (!cartItemsContainer || !subTotalPriceElement || !discountTotalPriceElement || !totalPriceElement) return;
        cartItemsContainer.innerHTML = '';
        let totalProduk = 0;
        let totalDiskon = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.4rem;">Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.dataset.productId = item.id;

                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <div class="cart-item-price-quantity">
                            <span class="cart-item-price">${formatCurrency(itemTotal)}</span>
                            <div class="quantity-control">
                                <button class="quantity-btn minus">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);

                totalProduk += itemTotal;
                totalDiskon += (item.originalPrice - item.price) * item.quantity;
            });
        }

        subTotalPriceElement.textContent = formatCurrency(totalProduk);
        discountTotalPriceElement.textContent = formatCurrency(totalDiskon);
        totalPriceElement.textContent = formatCurrency(totalProduk);
    }
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(event) {
            event.stopPropagation();
            const target = event.target;

            if (target.classList.contains('quantity-btn')) {
                const isMinus = target.classList.contains('minus');
                const productId = target.closest('.cart-item').dataset.productId;
                const itemIndex = cart.findIndex(i => i.id === productId);

                if (itemIndex > -1) {
                    if (isMinus) {
                        cart[itemIndex].quantity--;
                        if (cart[itemIndex].quantity === 0) {
                            cart.splice(itemIndex, 1);
                        }
                    } else {
                        cart[itemIndex].quantity++;
                    }
                    displayCartItems();
                    updateCartCount();
                }
            }
        });
    }

    document.querySelectorAll('.add-to-cart, .add-to-cart-popup').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card') || document.querySelector(`.product-card[data-product-id="${event.target.getAttribute('data-product-id')}"]`);
            if (!productCard) return;

            const productTitle = productCard.querySelector('.product-title').textContent;
            const productId = productCard.getAttribute('data-product-id');
            const productPrice = parseFloat(productCard.getAttribute('data-discount-price'));

            const originalPriceElement = productCard.querySelector('.original-price');
            const originalPrice = originalPriceElement ? parseFloat(originalPriceElement.textContent.replace('Rp', '').replace(/\./g, '')) : productPrice;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                const product = {
                    id: productId,
                    name: productTitle,
                    price: productPrice,
                    originalPrice: originalPrice,
                    quantity: 1
                };
                cart.push(product);
            }

            updateCartCount();

            const startPosition = button.getBoundingClientRect();
            const endPosition = document.getElementById('keranjang').getBoundingClientRect();
            if (!endPosition) return;

            const animatedProduct = document.createElement('div');
            animatedProduct.classList.add('animate-product');
            animatedProduct.style.top = `${startPosition.top + (startPosition.height / 2)}px`;
            animatedProduct.style.left = `${startPosition.left + (startPosition.width / 2)}px`;
            document.body.appendChild(animatedProduct);

            setTimeout(() => {
                animatedProduct.style.top = `${endPosition.top + (endPosition.height / 2)}px`;
                animatedProduct.style.left = `${endPosition.left + (endPosition.width / 2)}px`;
                animatedProduct.style.transform = 'scale(0.2)';
                animatedProduct.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                animatedProduct.remove();
            }, 1000);

            if (button.classList.contains('add-to-cart-popup') && productDetailPopup) {
                productDetailPopup.classList.remove('active');
            }
        });
    });

    if (keranjangIcon && cartPopup) {
        keranjangIcon.addEventListener('click', (event) => {
            event.stopPropagation();

            const isActive = cartPopup.classList.contains('active');
            cartPopup.classList.toggle('active');

            if (!isActive) {
                setPopupPosition();
                displayCartItems();
            }
        });
    }

    if (closeCartBtn && cartPopup) {
        closeCartBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            cartPopup.classList.remove('active');
        });
    }

    document.addEventListener('click', (event) => {
        if (!cartPopup || !keranjangIcon || !cartCount) return;
        const isClickInsidePopup = cartPopup.contains(event.target);
        const isClickOnIcon = keranjangIcon.contains(event.target);
        const isClickOnCartCount = cartCount.contains(event.target);

        if (!isClickInsidePopup && !isClickOnIcon && !isClickOnCartCount && cartPopup.classList.contains('active')) {
            cartPopup.classList.remove('active');
        }
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showAlert('Proses checkout dimulai!');
        });
    }

    window.addEventListener('resize', () => {
        if (cartPopup && cartPopup.classList.contains('active')) {
            setPopupPosition();
        }
    });

    // --- FUNGSI TOMBOL DETAIL & HAMBURGER ---

    // Fungsi untuk membuka pop-up detail produk
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            const productPrice = productCard.querySelector('.discount-price').textContent;

            popupProductTitle.textContent = productTitle;
            popupProductDescription.textContent = productDescription;
            popupProductPrice.textContent = productPrice;
            addToCartPopupBtn.setAttribute('data-product-id', productId);

            productDetailPopup.classList.add('active');
        });
    });

    // Fungsi untuk menutup pop-up detail produk
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            productDetailPopup.classList.remove('active');
        });
    }

    // Fungsi untuk membuka pop-up detail tutor
    document.querySelectorAll('.view-tutor-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const tutorCard = event.target.closest('.tutor-card');
            const tutorId = tutorCard.getAttribute('data-tutor-id');
            const tutor = tutorsData[tutorId];

            if (tutor) {
                popupTutorPhoto.src = tutor.photo;
                popupTutorName.textContent = tutor.name;
                popupTutorEducation.textContent = `Pendidikan: ${tutor.education}`;
                popupTutorTasks.textContent = `Tugas Terselesaikan: ${tutor.tasksCompleted}`;
                popupTutorDescription.textContent = tutor.description;
                selectTutorBtn.setAttribute('data-tutor-id', tutorId);
                tutorDetailPopup.classList.add('active');
            }
        });
    });

    // Fungsi untuk menutup pop-up detail tutor
    if (closeTutorPopupBtn) {
        closeTutorPopupBtn.addEventListener('click', () => {
            tutorDetailPopup.classList.remove('active');
        });
    }

    // Fungsionalitas Hamburger Menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (navbar) {
                navbar.classList.toggle('active');
            }
        });
    }

});
