// 1. Fungsi Sidebar Mobile
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

// 2. Fungsi Buka/Tutup Sub-menu Daftar Isi
function toggleDaftarIsi() {
    const dropdown = document.getElementById('materiDropdown');
    dropdown.classList.toggle('show');
}

// 3. Fungsi Navigasi Halaman
function showPage(event, pageId) {
    event.preventDefault();
    
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Reset status menu aktif pada link navigasi
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Tampilkan halaman target
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Aktifkan tombol yang diklik
    event.currentTarget.classList.add('active');

    // Tutup menu jika di layar HP
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
    
    // Scroll kembali ke atas saat ganti halaman
    window.scrollTo(0,0);
}

// 4. FUNGSI PENCARIAN MENU (SIDEBAR)
function searchMenu() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let menuItems = document.querySelectorAll('#menuList > li');
    let dropdownLinks = document.querySelectorAll('.dropdown-content li');
    let dropdownContainer = document.getElementById('materiDropdown');

    // Cari di menu utama (Beranda, Landasan, Kontak)
    menuItems.forEach(item => {
        let text = item.innerText.toLowerCase();
        // Jangan sembunyikan container daftar isi jika anak-anaknya ada yang cocok
        if (item.classList.contains('daftar-isi-container')) return;
        
        item.style.display = text.includes(input) ? "" : "none";
    });

    // Cari di dalam submenu (PDCA, JSA, dll)
    let matchInDropdown = false;
    dropdownLinks.forEach(link => {
        let text = link.innerText.toLowerCase();
        if (text.includes(input)) {
            link.style.display = "";
            matchInDropdown = true;
        } else {
            link.style.display = "none";
        }
    });

    // Logika buka otomatis dropdown jika hasil cari ditemukan
    if (input !== "" && matchInDropdown) {
        dropdownContainer.classList.add('show');
        document.querySelector('.daftar-isi-container').style.display = "";
    } else if (input !== "" && !matchInDropdown) {
        // Sembunyikan container daftar isi jika tidak ada yang cocok di dalamnya
        document.querySelector('.daftar-isi-container').style.display = "none";
    } else {
        // Reset jika input kosong
        dropdownContainer.classList.remove('show');
        document.querySelector('.daftar-isi-container').style.display = "";
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