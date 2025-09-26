document.addEventListener('DOMContentLoaded', () => {
    const prices = {
        bw: 250,
        color: 500,
        printBw: 300,
        printColor: 600,
        '2x3': 2000,
        '3x4': 2500,
        '4x6': 3000,
        ...JSON.parse(localStorage.getItem('appPrices'))
    };

    function savePrices() {
        localStorage.setItem('appPrices', JSON.stringify(prices));
    }


    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    }

    // --- Pengaturan Page ---
    if (document.getElementById('simpan-pengaturan')) {
        document.getElementById('harga-bw').value = prices.bw;
        document.getElementById('harga-warna').value = prices.color;
        document.getElementById('harga-print-bw').value = prices.printBw;
        document.getElementById('harga-print-warna').value = prices.printColor;
        document.getElementById('harga-2x3').value = prices['2x3'];
        document.getElementById('harga-3x4').value = prices['3x4'];
        document.getElementById('harga-4x6').value = prices['4x6'];

        document.getElementById('simpan-pengaturan').addEventListener('click', () => {
            prices.bw = parseInt(document.getElementById('harga-bw').value);
            prices.color = parseInt(document.getElementById('harga-warna').value);
            prices.printBw = parseInt(document.getElementById('harga-print-bw').value);
            prices.printColor = parseInt(document.getElementById('harga-print-warna').value);
            prices['2x3'] = parseInt(document.getElementById('harga-2x3').value);
            prices['3x4'] = parseInt(document.getElementById('harga-3x4').value);
            prices['4x6'] = parseInt(document.getElementById('harga-4x6').value);
            savePrices();
            alert('Pengaturan harga berhasil disimpan!');
        });
    }

    // --- Fotocopy Page ---
    if (document.getElementById('hitung-fotocopy')) {
        const lembarInput = document.getElementById('lembar');
        const rangkapInput = document.getElementById('rangkap');
        const hasilDiv = document.getElementById('hasil-fotocopy');

        document.getElementById('hitung-fotocopy').addEventListener('click', () => {
            const lembar = parseInt(lembarInput.value);
            const rangkap = parseInt(rangkapInput.value);
            const jenisCetak = document.querySelector('input[name="jenis-cetak"]:checked').value;

            if (isNaN(lembar) || lembar <= 0) {
                alert('Masukkan jumlah lembar yang valid.');
                return;
            }

            const totalLembar = lembar * rangkap;
            const hargaSatuan = prices[jenisCetak];
            const totalHarga = totalLembar * hargaSatuan;

            document.getElementById('total-lembar').textContent = totalLembar;
            document.getElementById('total-harga-fotocopy').textContent = formatRupiah(totalHarga);
            hasilDiv.style.display = 'block';
        });

        document.getElementById('simpan-fotocopy').addEventListener('click', () => {
            const totalHargaText = document.getElementById('total-harga-fotocopy').textContent;
            const totalHarga = parseInt(totalHargaText.replace(/[^0-9]/g, ''));
            const deskripsi = `${document.getElementById('total-lembar').textContent} lbr fotokopi (${document.querySelector('input[name="jenis-cetak"]:checked').value === 'bw' ? 'H/P' : 'Warna'})`;
            simpanTransaksi(deskripsi, totalHarga);
            alert('Transaksi berhasil disimpan.');
            lembarInput.value = '';
            rangkapInput.value = '1';
            hasilDiv.style.display = 'none';
        });
    }

    // --- Foto Page ---
    if (document.getElementById('hitung-foto')) {
        const jumlahInput = document.getElementById('jumlah-foto');
        const hasilDiv = document.getElementById('hasil-foto');

        document.getElementById('hitung-foto').addEventListener('click', () => {
            const jumlah = parseInt(jumlahInput.value);
            const ukuran = document.getElementById('ukuran-foto').value;

            if (isNaN(jumlah) || jumlah <= 0) {
                alert('Masukkan jumlah cetak yang valid.');
                return;
            }

            const hargaSatuan = prices[ukuran];
            const totalHarga = jumlah * hargaSatuan;

            document.getElementById('total-harga-foto').textContent = formatRupiah(totalHarga);
            hasilDiv.style.display = 'block';
        });

        document.getElementById('simpan-foto').addEventListener('click', () => {
            const totalHargaText = document.getElementById('total-harga-foto').textContent;
            const totalHarga = parseInt(totalHargaText.replace(/[^0-9]/g, ''));
            const deskripsi = `${jumlahInput.value}x cetak foto ukuran ${document.getElementById('ukuran-foto').value}`;
            simpanTransaksi(deskripsi, totalHarga);
            alert('Transaksi berhasil disimpan.');
            jumlahInput.value = '';
            hasilDiv.style.display = 'none';
        });
    }

    // --- Print Out Page ---
    if (document.getElementById('hitung-print')) {
        const halamanInput = document.getElementById('halaman');
        const hasilDiv = document.getElementById('hasil-print');

        document.getElementById('hitung-print').addEventListener('click', () => {
            const halaman = parseInt(halamanInput.value);
            const jenisPrint = document.querySelector('input[name="jenis-print"]:checked').value;

            if (isNaN(halaman) || halaman <= 0) {
                alert('Masukkan jumlah halaman yang valid.');
                return;
            }

            const hargaSatuan = prices[jenisPrint];
            const totalHarga = halaman * hargaSatuan;

            document.getElementById('total-harga-print').textContent = formatRupiah(totalHarga);
            hasilDiv.style.display = 'block';
        });

        document.getElementById('simpan-print').addEventListener('click', () => {
            const totalHargaText = document.getElementById('total-harga-print').textContent;
            const totalHarga = parseInt(totalHargaText.replace(/[^0-9]/g, ''));
            const jenisPrint = document.querySelector('input[name="jenis-print"]:checked').value === 'printBw' ? 'H/P' : 'Warna';
            const deskripsi = `${halamanInput.value} lbr print (${jenisPrint})`;
            simpanTransaksi(deskripsi, totalHarga);
            alert('Transaksi berhasil disimpan.');
            halamanInput.value = '';
            hasilDiv.style.display = 'none';
        });
    }

    // --- Riwayat Page ---
    if (document.getElementById('list-riwayat')) {
        tampilkanRiwayat();
        document.getElementById('hapus-riwayat').addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menghapus semua riwayat transaksi?')) {
                localStorage.removeItem('transaksi');
                tampilkanRiwayat();
            }
        });

        document.getElementById('cetak-riwayat').addEventListener('click', () => {
            window.print();
        });
    }

    // --- Transaction Logic ---
    function simpanTransaksi(deskripsi, harga) {
        const riwayat = JSON.parse(localStorage.getItem('transaksi')) || [];
        const transaksiBaru = {
            id: Date.now(),
            deskripsi: deskripsi,
            harga: harga,
            waktu: new Date().toLocaleString('id-ID')
        };
        riwayat.push(transaksiBaru);
        localStorage.setItem('transaksi', JSON.stringify(riwayat));
    }

    function tampilkanRiwayat() {
        const riwayat = JSON.parse(localStorage.getItem('transaksi')) || [];
        const listRiwayat = document.getElementById('list-riwayat');
        const totalPendapatanEl = document.getElementById('total-pendapatan');
        
        listRiwayat.innerHTML = '';
        let totalPendapatan = 0;

        if (riwayat.length === 0) {
            listRiwayat.innerHTML = '<li>Tidak ada riwayat transaksi.</li>';
        } else {
            riwayat.reverse().forEach(trx => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <div class="item-details">
                        ${trx.deskripsi}
                        <div class="item-time">${trx.waktu}</div>
                    </div>
                    <div class="item-price">${formatRupiah(trx.harga)}</div>
                `;
                listRiwayat.appendChild(item);
                totalPendapatan += trx.harga;
            });
        }
        totalPendapatanEl.textContent = formatRupiah(totalPendapatan);
    }
});
