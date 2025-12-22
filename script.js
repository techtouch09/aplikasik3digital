// ============================================================
// 0. FUNGSI SELAMAT DATANG & AUTO-RESTORE (REFRESH)
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    // A. Logika Selamat Datang Otomatis
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('show');
            overlay.style.display = 'flex'; 
        }, 300);
    }

    // B. Logika Restore Halaman (Agar tetap di halaman terakhir saat refresh)
    const lastPage = localStorage.getItem('lastOpenedPage');
    if (lastPage) {
        showPage(null, lastPage);
        
        // Buka dropdown otomatis jika halaman terakhir ada di dalam materi
        const targetLink = document.querySelector(`[onclick*="${lastPage}"]`);
        if (targetLink && targetLink.closest('#materiDropdown')) {
            const dropdown = document.getElementById('materiDropdown');
            const container = document.querySelector('.daftar-isi-container');
            if (dropdown) {
                dropdown.classList.add('show');
                dropdown.style.display = "block";
                if (container) container.classList.add('active');
            }
        }
    }
});

function closeWelcome() {
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }
}

// ============================================================
// KODE UTAMA (DIPERBAIKI UNTUK PENCARIAN & REFRESH)
// ============================================================

// 1. Fungsi Sidebar Mobile
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
    sidebar.classList.toggle('active'); // Sinkronisasi dengan class active jika ada
}

// 2. Fungsi Buka/Tutup Sub-menu Daftar Isi
function toggleDaftarIsi(event) {
    if (event) event.stopPropagation(); // Mencegah event "klik di mana saja" memicu penutupan instan
    
    const container = document.querySelector('.daftar-isi-container');
    const dropdown = document.getElementById('materiDropdown');
    
    container.classList.toggle('active');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        dropdown.style.display = "none";
    } else {
        dropdown.classList.add('show');
        dropdown.style.display = "block";
    }
}

// 3. Fungsi Navigasi Halaman
function showPage(event, pageId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation(); // Penting agar tidak bentrok dengan event klik global
    }
    
    // Simpan ID halaman ke localStorage agar tidak hilang saat refresh
    localStorage.setItem('lastOpenedPage', pageId);
    
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Reset status menu aktif pada semua link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Tampilkan halaman target
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Aktifkan link yang diklik
    const activeLink = event ? event.currentTarget : document.querySelector(`[onclick*="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // TUTUP OTOMATIS: Sidebar dan Dropdown setelah memilih materi
    closeAllMenus();
    
    // Scroll ke atas otomatis
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. FUNGSI PENUTUP GLOBAL (Klik di mana saja)
function closeAllMenus() {
    // Tutup Sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('active');
    }

    // Tutup Dropdown Daftar Isi
    const container = document.querySelector('.daftar-isi-container');
    const dropdown = document.getElementById('materiDropdown');
    if (container) container.classList.remove('active');
    if (dropdown) {
        dropdown.classList.remove('show');
        dropdown.style.display = "none";
    }
}

// Event Listener: Deteksi klik di seluruh dokumen
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');

    // Jika klik di luar sidebar DAN di luar tombol buka menu, maka tutup semua
    if (sidebar && menuToggle) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeAllMenus();
        }
    }
});

// 5. FUNGSI PENCARIAN MENU (Bisa mencari materi & landasan hukum)
function searchMenu() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let menuItems = document.querySelectorAll('#menuList > li');
    let dropdownLinks = document.querySelectorAll('.dropdown-content li');
    let dropdownContainer = document.getElementById('materiDropdown');
    let containerWrap = document.querySelector('.daftar-isi-container');

    let matchInDropdown = false;

    // A. Cari di dalam Dropdown Materi
    dropdownLinks.forEach(link => {
        let text = link.innerText.toLowerCase();
        if (text.includes(input)) {
            link.style.display = "";
            matchInDropdown = true;
        } else {
            link.style.display = "none";
        }
    });

    // B. Cari di Menu Utama (Beranda, Landasan Hukum, dll)
    menuItems.forEach(item => {
        // Abaikan item yang merupakan container dropdown itu sendiri
        if (!item.classList.contains('daftar-isi-container')) {
            let text = item.innerText.toLowerCase();
            item.style.display = text.includes(input) ? "" : "none";
        }
    });

    // C. Atur tampilan Dropdown Materi berdasarkan hasil cari
    if (input !== "") {
        if (matchInDropdown) {
            dropdownContainer.classList.add('show');
            dropdownContainer.style.display = "block";
            containerWrap.style.display = "";
        } else {
            containerWrap.style.display = "none"; // Sembunyikan folder materi jika tidak ada yang cocok
        }
    } else {
        // Jika input kosong, kembalikan ke setelan awal
        dropdownContainer.classList.remove('show');
        dropdownContainer.style.display = "none";
        containerWrap.style.display = "";
        menuItems.forEach(item => item.style.display = "");
    }
}
// 5. FUNGSI PENCARIAN KHUSUS TABEL LANDASAN HUKUM
function filterLawTable() {
    // Ambil input pencarian
    const input = document.getElementById("lawSearch");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("lawTable");
    const tr = table.getElementsByTagName("tr");

    // Loop semua baris tabel (mulai dari indeks 1 karena 0 adalah header)
    for (let i = 1; i < tr.length; i++) {
        let found = false;
        const td = tr[i].getElementsByTagName("td");
        
        // Cek di setiap kolom (Materi, Regulasi, Tentang, Pasal, Deskripsi)
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break; // Jika ditemukan di satu kolom, lanjut ke baris berikutnya
                }
            }
        }
        
        // Tampilkan atau sembunyikan baris berdasarkan hasil pencarian
        tr[i].style.display = found ? "" : "none";
    }
}
// 7. FUNGSI PENGIRIMAN FORM KONTAK (DIHUBUNGKAN KE WHATSAPP)
function submitKontak(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    const nama = document.getElementById('namaKontak').value;
    const pesan = document.getElementById('pesanKontak').value;
    const nomorWA = "6287877611218"; // Format harus diawali 62 (pengganti angka 0)

    if (nama && pesan) {
        const btn = event.target.querySelector('.btn-kirim');
        btn.innerText = "Membuka WhatsApp...";
        btn.disabled = true;

        // Menyusun format pesan untuk WhatsApp
        // %0A adalah kode untuk baris baru (enter)
        const teksPesan = `Halo Admin K3 Digital,%0A%0A` +
                          `*Nama:* ${nama}%0A` +
                          `*Pesan/Kendala:* ${pesan}`;

        setTimeout(() => {
            // Membuka link WhatsApp di tab baru
            window.open(`https://wa.me/${nomorWA}?text=${teksPesan}`, '_blank');

            // Reset Form dan tombol setelah berhasil membuka WA
            alert(`Sistem sedang mengarahkan Anda ke WhatsApp Admin.`);
            document.getElementById('contactForm').reset();
            btn.innerText = "Kirim Pesan Sekarang";
            btn.disabled = false;
        }, 1000);
    } else {
        alert("Mohon isi Nama dan Pesan terlebih dahulu.");
    }
}
// 6. FUNGSI LOGOUT
function handleLogout() {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        localStorage.removeItem('lastOpenedPage'); // Hapus history agar tidak auto-load lagi
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 500);
    }
}
if (localStorage.getItem('k3_logged_in') !== 'true') {
    window.location.href = 'login.html';
}
async function generatePDF() {
    const selectElement = document.getElementById('selectMateri');
    const selectedId = selectElement.value; 
    const selectedText = selectElement.options[selectElement.selectedIndex].text;

    const materiSection = document.getElementById(selectedId);
    if (!materiSection) {
        alert("Konten materi tidak ditemukan!");
        return;
    }

    const btn = document.querySelector('.btn-generate');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyelaraskan Tabel...';
    btn.disabled = true;

    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.padding = "20px";
    pdfWrapper.style.fontFamily = "'Arial', sans-serif";

    // --- HALAMAN 1: ISI MATERI ---
    pdfWrapper.innerHTML += `
        <div style="text-align: center; border-bottom: 3px solid #a52a2a; margin-bottom: 20px; padding-bottom: 10px;">
            <h1 style="color: #a52a2a; font-size: 18px; margin: 0; text-transform: uppercase; font-weight: bold;">${selectedText}</h1>
        </div>
    `;
    
    // Mengambil konten materi
    const detailItems = materiSection.querySelectorAll('.detail-item, .example-tag');
    detailItems.forEach(item => {
        const itemClone = item.cloneNode(true);
        itemClone.style.marginBottom = "15px";
        itemClone.style.fontSize = "12px";
        pdfWrapper.appendChild(itemClone);
    });

    // --- PEMISAH HALAMAN ---
    const pageBreak = document.createElement('div');
    pageBreak.style.pageBreakBefore = "always";
    pdfWrapper.appendChild(pageBreak);

    // --- HALAMAN 2: LANDASAN HUKUM ---
    pdfWrapper.innerHTML += `<h2 style="color: #a52a2a; border-left: 5px solid #a52a2a; padding-left: 10px; font-size: 15px; margin-bottom: 15px; text-transform: uppercase;">Landasan Hukum Terkait</h2>`;

    const tableHukum = document.querySelector('#landasan table');
    if (tableHukum) {
        const newTable = document.createElement('table');
        
        // KUNCI UTAMA: Table Layout Fixed & Width 100%
        newTable.style.width = "100%";
        newTable.style.borderCollapse = "collapse";
        newTable.style.tableLayout = "fixed"; 
        newTable.style.fontSize = "10px";
        newTable.style.border = "1.5px solid #a52a2a";

        const cleanTitle = selectedText.replace(/^\d+\.\s*/, '').toLowerCase().trim();
        const rows = tableHukum.querySelectorAll('tr');
        let found = false;

        rows.forEach((row, index) => {
            const isHeader = index === 0 || row.parentElement.tagName === 'THEAD';
            const rowContent = row.innerText.toLowerCase();

            if (isHeader || rowContent.includes(cleanTitle)) {
                const rowClone = row.cloneNode(true);
                const cells = rowClone.querySelectorAll('th, td');
                
                cells.forEach((cell, cellIndex) => {
                    cell.style.padding = "10px";
                    cell.style.wordWrap = "break-word";
                    cell.style.boxSizing = "border-box";
                    
                    // PENETAPAN LEBAR KOLOM YANG SAMA UNTUK HEADER & ISI
                    // Sesuaikan persentase ini dengan jumlah kolom Anda
                    if (cellIndex === 0) cell.style.width = "15%"; // Materi
                    if (cellIndex === 1) cell.style.width = "25%"; // Regulasi
                    if (cellIndex === 2) cell.style.width = "25%"; // Tentang
                    if (cellIndex === 3) cell.style.width = "10%"; // Pasal
                    if (cellIndex === 4) cell.style.width = "25%"; // Deskripsi

                    if (isHeader) {
                        cell.style.backgroundColor = "#a52a2a"; 
                        cell.style.color = "#ffffff";
                        cell.style.border = "1px solid #ffffff"; // Pembatas putih di header agar rata
                        cell.style.textAlign = "center";
                        cell.style.verticalAlign = "middle";
                        cell.style.fontWeight = "bold";
                    } else {
                        cell.style.backgroundColor = "#ffffff";
                        cell.style.color = "#000000";
                        cell.style.border = "1px solid #a52a2a"; // Pembatas merah ati di isi
                        cell.style.textAlign = "left";
                        cell.style.verticalAlign = "top";
                        found = true;
                    }
                });
                newTable.appendChild(rowClone);
            }
        });

        if (found) {
            pdfWrapper.appendChild(newTable);
        }
    }

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Laporan_K3_${selectedText.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(pdfWrapper).save();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}