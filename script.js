
document.addEventListener('DOMContentLoaded', function() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.getElementById('message');

    const localStorageKey = 'countdownTargetDate';
    let targetDate;

    // Fungsi untuk menghitung tanggal target (3 tahun 1 bulan dari sekarang)
    function calculateTargetDate() {
        const now = new Date();
        // Set tanggal target 3 tahun ke depan
        now.setFullYear(now.getFullYear() + 3);
        // Set 1 bulan ke depan
        now.setMonth(now.getMonth() + 1);
        // Kembali ke format milidetik untuk penyimpanan
        return now.getTime();
    }

    // Cek apakah target sudah ada di LocalStorage
    const storedTarget = localStorage.getItem(localStorageKey);

    if (storedTarget) {
        // Gunakan target yang sudah ada
        targetDate = parseInt(storedTarget, 10);
    } else {
        // Hitung dan simpan target baru
        targetDate = calculateTargetDate();
        localStorage.setItem(localStorageKey, targetDate);
    }

    // Fungsi untuk memperbarui hitung mundur
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now; // Jarak waktu dalam milidetik

        // Jika hitung mundur selesai
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('timer').style.display = 'none';
            messageEl.innerHTML = "Waktu telah tiba! Hitung mundur selesai.";
            // Opsional: Hapus target dari LocalStorage jika sudah selesai
            localStorage.removeItem(localStorageKey);
            return;
        }

        // Perhitungan waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Menampilkan hasilnya
        daysEl.innerHTML = String(days).padStart(2, '0');
        hoursEl.innerHTML = String(hours).padStart(2, '0');
        minutesEl.innerHTML = String(minutes).padStart(2, '0');
        secondsEl.innerHTML = String(seconds).padStart(2, '0');
    }

    // Panggil updateCountdown setiap 1 detik
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Panggil sekali saat dimuat untuk menghindari jeda 1 detik
    updateCountdown();
});

