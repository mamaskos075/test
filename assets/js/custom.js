document.addEventListener('DOMContentLoaded', () => {

    // Data foto untuk setiap album
    const photoData = {
        album1: [
            "https://via.placeholder.com/600x400.png?text=Foto+1",
            "https://via.placeholder.com/600x400.png?text=Foto+2",
            "https://via.placeholder.com/600x400.png?text=Foto+3",
            "https://via.placeholder.com/600x400.png?text=Foto+4",
            "https://via.placeholder.com/600x400.png?text=Foto+5"
        ],
        album2: [
            "https://via.placeholder.com/600x400.png?text=Foto+Ayang+A",
            "https://via.placeholder.com/600x400.png?text=Foto+Ayang+B",
            "https://via.placeholder.com/600x400.png?text=Foto+Ayang+C"
        ],
        album3: [
            "https://via.placeholder.com/600x400.png?text=Foto+Kita+X",
            "https://via.placeholder.com/600x400.png?text=Foto+Kita+Y"
        ]
    };

    const ctaButtons = document.querySelectorAll('.cta-button');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-button');
    const photoGrid = document.querySelector('.photo-grid');

    // Menangani klik tombol "Buka Galeri"
    ctaButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const albumSection = event.target.closest('.album-section');
            const albumId = albumSection.id;
            
            // Bersihkan konten modal sebelumnya
            photoGrid.innerHTML = '';
            
            // Muat foto-foto sesuai album yang diklik
            const photos = photoData[albumId];
            if (photos) {
                photos.forEach(photoUrl => {
                    const img = document.createElement('img');
                    img.src = photoUrl;
                    img.alt = 'Foto Galeri';
                    photoGrid.appendChild(img);
                });
            }

            modal.style.display = 'block';
        });
    });

    // Menutup modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Efek scroll untuk setiap album
    const albumSections = document.querySelectorAll('.album-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    albumSections.forEach(section => {
        observer.observe(section);
    });
});


