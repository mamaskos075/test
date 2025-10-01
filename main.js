/**
 * Fungsi untuk menghasilkan 100 link WhatsApp.
 * Fungsi ini dipanggil saat tombol di index.html diklik.
 */
function generateLinks() {
    // Ambil nilai dari input HTML
    const target = document.getElementById('targetNumber').value.trim();
    const baseMessage = document.getElementById('messageContent').value;
    const outputDiv = document.getElementById('output');
    
    // Hapus konten sebelumnya dan tambahkan instruksi
    outputDiv.innerHTML = '<p>Klik link di bawah satu per satu:</p>';

    if (!target) {
        alert('Mohon masukkan nomor target!');
        return;
    }

    // Loop dari 1 hingga 100
    for (let i = 1; i <= 100; i++) {
        // Gabungkan pesan dasar dengan nomor urut
        const message = baseMessage + i;
        
        // Encode pesan agar aman dalam URL
        const encodedMessage = encodeURIComponent(message);
        
        // Buat URL resmi WhatsApp
        // wa.me adalah metode yang disarankan
        const whatsappUrl = `https://wa.me/${target}?text=${encodedMessage}`;
        
        // Buat elemen <a> (link) di HTML
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank'; // Buka di tab/jendela baru
        link.className = 'message-link';
        link.textContent = `Link ${i}: Kirim Pesan "${message.substring(0, 40)}..."`;
        
        // Tambahkan link ke div output
        outputDiv.appendChild(link);
    }
}
