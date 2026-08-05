import { useState, useMemo, useEffect } from 'react'
import SidebarKaryawan from '../../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../../components/Navbar/NavbarKaryawan'
import KeripikSingkong from '../../../../assets/image_product/Keripik_Singkong.png'
import RotiCoklat from '../../../../assets/image_product/Roti_Coklat.png'
import SirupMarkisa from '../../../../assets/image_product/Sirup_Markisa.png'

// Dummy data produk
const PRODUK_LIST = [
    { id: 1, nama: 'Keripik Singkong', foto: KeripikSingkong, kategori: 'Snack', kepemilikan: 'Titipan', stok: 24, harga: 15000 },
    { id: 2, nama: 'Roti Coklat', foto: RotiCoklat, kategori: 'Makanan', kepemilikan: 'Pribadi', stok: 18, harga: 12000 },
    { id: 3, nama: 'Sirup Markisa', foto: SirupMarkisa, kategori: 'Minuman', kepemilikan: 'Pribadi', stok: 40, harga: 25000 },
]

const KATEGORI_LIST = ['Makanan', 'Minuman', 'Snack']
const KATEGORI_STYLE = {
    Makanan: 'bg-blue-50 text-blue-600',
    Minuman: 'bg-emerald-50 text-emerald-600',
    Snack: 'bg-amber-50 text-amber-600',
}

const KEPEMILIKAN_LIST = ['Titipan', 'Pribadi']
const KEPEMILIKAN_STYLE = {
    Titipan: 'bg-purple-50 text-purple-600',
    Pribadi: 'bg-slate-100 text-slate-600',
}

// Dummy detail statis — nanti diganti data asli sesuai produk yang diklik
const DETAIL_STATIS = {
    kode: 'PROD/KSK/01',
    penitip: 'Budi',
    hargaTitip: 10000,
    tanggalInput: '02 Agu 2026',
}

const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

function IndexProduk() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [produkList] = useState(PRODUK_LIST)
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailProduk, setDetailProduk] = useState(null)

    // Filter state
    const [search, setSearch] = useState('')
    const [filterKategori, setFilterKategori] = useState('all')
    const [filterKepemilikan, setFilterKepemilikan] = useState('all')

    const filteredData = useMemo(() => {
        return produkList.filter((prd) => {
            const matchSearch = prd.nama.toLowerCase().includes(search.toLowerCase())
            const matchKategori = filterKategori === 'all' || prd.kategori === filterKategori
            const matchKepemilikan = filterKepemilikan === 'all' || prd.kepemilikan === filterKepemilikan
            return matchSearch && matchKategori && matchKepemilikan
        })
    }, [produkList, search, filterKategori, filterKepemilikan])

    const openDetail = (prd) => {
        setDetailProduk(prd)
        setDetailOpen(true)
    }

    const closeDetail = () => {
        setDetailOpen(false)
        setDetailProduk(null)
    }

    // Tutup modal saat tekan Escape
    useEffect(() => {
        if (!detailOpen) return
        const handleKey = (e) => {
            if (e.key === 'Escape') closeDetail()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [detailOpen])

    const komisiTokoA = detailProduk
        ? detailProduk.harga - DETAIL_STATIS.hargaTitip
        : 0

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="produk"
            />

            <div className="lg:pl-72">
                <NavbarKaryawan
                    title="Inventory"
                    subtitle="Kelola Informasi Inventory"
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                                Data Produk
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Kelola produk yang tersedia
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href='/karyawan/produk/add'
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                            >
                                <i className="ri-add-line text-lg"></i>
                                <span>Tambah Produk</span>
                            </a>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Filter row */}
                        <div className="flex flex-wrap items-end gap-3 px-5 sm:px-6 py-5 border-b border-slate-100">
                            {/* Filter kategori */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="filter-kategori" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    Kategori
                                </label>
                                <select
                                    id="filter-kategori"
                                    value={filterKategori}
                                    onChange={(e) => setFilterKategori(e.target.value)}
                                    className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {KATEGORI_LIST.map((kat) => (
                                        <option key={kat} value={kat}>{kat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter kepemilikan */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="filter-kepemilikan" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    Kepemilikan
                                </label>
                                <select
                                    id="filter-kepemilikan"
                                    value={filterKepemilikan}
                                    onChange={(e) => setFilterKepemilikan(e.target.value)}
                                    className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                >
                                    <option value="all">Semua Kepemilikan</option>
                                    {KEPEMILIKAN_LIST.map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-1 flex-1 min-w-[200px] sm:min-w-[240px]">
                                <label htmlFor="filter-search" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    Cari Produk
                                </label>
                                <div className="relative">
                                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                    <input
                                        id="filter-search"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama produk..."
                                        className="w-full text-xs font-medium text-slate-600 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                                        <th className="px-5 sm:px-6 py-3 font-bold">No</th>
                                        <th className="px-5 py-3 font-bold">Produk</th>
                                        <th className="px-5 py-3 font-bold">Kategori</th>
                                        <th className="px-5 py-3 font-bold">Kepemilikan</th>
                                        <th className="px-5 py-3 font-bold">Stock</th>
                                        <th className="px-5 py-3 font-bold">Harga</th>
                                        <th className="px-5 sm:px-6 py-3 font-bold text-left w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                                Tidak ada produk yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredData.map((prd, idx) => (
                                        <tr key={prd.id} className="hover:bg-slate-50/70">
                                            <td className="px-5 sm:px-6 py-3.5 text-slate-500 font-semibold">
                                                {idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={prd.foto}
                                                        alt={prd.nama}
                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                                                    />
                                                    <span className="font-bold text-slate-700">{prd.nama}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${KATEGORI_STYLE[prd.kategori] ?? 'bg-slate-100 text-slate-600'}`}>
                                                    {prd.kategori}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${KEPEMILIKAN_STYLE[prd.kepemilikan] ?? 'bg-slate-100 text-slate-600'}`}>
                                                    {prd.kepemilikan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600 font-semibold">
                                                {prd.stok}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600 font-semibold">
                                                {formatRupiah(prd.harga)}
                                            </td>
                                            <td className="px-5 sm:px-6 py-3.5 w-32">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openDetail(prd)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                                        title="Detail"
                                                    >
                                                        <i className="ri-eye-line text-base"></i>
                                                    </button>
                                                    <a href='/karyawan/produk/edit' className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600" title="Edit">
                                                        <i className="ri-edit-line text-base"></i>
                                                    </a>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500" title="Hapus">
                                                        <i className="ri-delete-bin-line text-base"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Detail Produk */}
            {detailOpen && detailProduk && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
                    onClick={closeDetail}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">Detail Produk</h2>
                            <button
                                onClick={closeDetail}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <i className="ri-close-line text-lg"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            {/* Foto + nama + kode */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={detailProduk.foto}
                                    alt={detailProduk.nama}
                                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                                />
                                <div>
                                    <p className="font-bold text-slate-800">{detailProduk.nama}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        {DETAIL_STATIS.kode}
                                    </p>
                                </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Kategori</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{detailProduk.kategori}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Kepemilikan</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">
                                        {detailProduk.kepemilikan}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Stok</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{detailProduk.stok} unit</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Tgl Input</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{DETAIL_STATIS.tanggalInput}</p>
                                </div>
                            </div>

                            {/* Harga jual */}
                            <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                                <span className="text-sm font-bold text-blue-900">Harga Jual</span>
                                <span className="text-lg font-extrabold text-blue-600">
                                    {formatRupiah(detailProduk.harga)}
                                </span>
                            </div>

                            {/* Info titipan — hanya tampil kalau kepemilikan Titipan */}
                            {/* Info titipan — hanya tampil kalau kepemilikan Titipan */}
                            {detailProduk.kepemilikan === 'Titipan' && (
                                <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4 space-y-2.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-store-2-line text-emerald-600"></i>
                                        <span className="text-sm font-bold text-emerald-800">
                                            {DETAIL_STATIS.penitip} (Penitip)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-emerald-700 font-medium">Harga Titip </span>
                                        <span className="font-bold text-emerald-900">
                                            {formatRupiah(DETAIL_STATIS.hargaTitip)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-emerald-700 font-medium">Komisi Toko</span>
                                        <span className="font-bold text-emerald-900">
                                            {formatRupiah(komisiTokoA)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-emerald-500 font-medium pt-1 border-t border-emerald-100">
                                        Saat barang laku, {DETAIL_STATIS.penitip} menerima {formatRupiah(DETAIL_STATIS.hargaTitip)}, sisanya {formatRupiah(komisiTokoA)} jadi komisi toko.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}

                    </div>
                </div>
            )}
        </div>
    )
}

export default IndexProduk