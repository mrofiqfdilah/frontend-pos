import { useState, useEffect, useMemo } from 'react'
import SidebarKaryawan from '../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../components/Navbar/NavbarKaryawan'

const KATEGORI_STYLE = {
    Pemasukan: 'bg-emerald-50 text-emerald-600',
    Pengeluaran: 'bg-red-50 text-red-500',
}

const KATEGORI_SEQUENCE = [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0]

const TRANSAKSI_PEMASUKAN = [
    { label: 'Penjualan Kasir', note: 'Penjualan produk melalui kasir toko' },
]
const TRANSAKSI_PENGELUARAN = [
    { label: 'Membeli Barang', note: 'Restock bahan baku dari supplier' },
    { label: 'Bayar Listrik', note: 'Pembayaran tagihan listrik bulanan toko' },
    { label: 'Gaji Karyawan', note: 'Pembayaran gaji karyawan periode berjalan' },
]

function generateJournal() {
    const data = []
    for (let i = 1; i <= 20; i++) {
        const isPemasukan = KATEGORI_SEQUENCE[i - 1] === 0
        const kategori = isPemasukan ? 'Pemasukan' : 'Pengeluaran'
        const trxPool = isPemasukan ? TRANSAKSI_PEMASUKAN : TRANSAKSI_PENGELUARAN
        const trx = trxPool[i % trxPool.length]
        const nominal = 50000 + ((i * 37) % 12) * 25000
        const day = String(((i - 1) % 4) + 1).padStart(2, '0')
        const hour = String(8 + (i % 10)).padStart(2, '0')
        const minute = String((i * 7) % 60).padStart(2, '0')

        data.push({
            id: i,
            kode: `JRNL/${day}0826/${String(i).padStart(2, '0')}`,
            tanggal: `${day} Agu 2026`,
            isoDate: `2026-08-${day}`,
            waktu: `${hour}:${minute}`,
            kategori,
            transaksi: trx.label,
            note: trx.note,
            nominal,
        })
    }
    return data.sort((a, b) => `${b.isoDate} ${b.waktu}`.localeCompare(`${a.isoDate} ${a.waktu}`))
}

const formatRupiah = (n) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`

function JournalKeuangan() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [journalList] = useState(generateJournal)
    const [search, setSearch] = useState('')
    const [filterKategori, setFilterKategori] = useState('all')
    const [filterTanggal, setFilterTanggal] = useState('')
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    // Modal detail
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailTrx, setDetailTrx] = useState(null)

    // Ringkasan
    const summary = useMemo(() => {
        const totalPemasukan = journalList
            .filter((j) => j.kategori === 'Pemasukan')
            .reduce((sum, j) => sum + j.nominal, 0)
        const totalPengeluaran = journalList
            .filter((j) => j.kategori === 'Pengeluaran')
            .reduce((sum, j) => sum + j.nominal, 0)
        return {
            totalPemasukan,
            totalPengeluaran,
            saldoBersih: totalPemasukan - totalPengeluaran,
        }
    }, [journalList])

    const filteredData = useMemo(() => {
        return journalList.filter((j) => {
            const matchSearch =
                j.kode.toLowerCase().includes(search.toLowerCase()) ||
                j.transaksi.toLowerCase().includes(search.toLowerCase())
            const matchKategori = filterKategori === 'all' || j.kategori === filterKategori
            const matchTanggal = !filterTanggal || j.isoDate === filterTanggal
            return matchSearch && matchKategori && matchTanggal
        })
    }, [journalList, search, filterKategori, filterTanggal])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, filterKategori, filterTanggal, perPage])

    const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage))
    const paginatedData = filteredData.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    )

    const openDetail = (trx) => {
        setDetailTrx(trx)
        setDetailOpen(true)
    }

    const closeDetail = () => {
        setDetailOpen(false)
        setDetailTrx(null)
    }

    useEffect(() => {
        if (!detailOpen) return
        const handleKey = (e) => {
            if (e.key === 'Escape') closeDetail()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [detailOpen])

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="journal"
            />

            <div className="lg:pl-72">
                <NavbarKaryawan
                    title="Accounting"
                    subtitle="Informasi mengenai keuangan toko"
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                                Journal Keuangan
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Catatan pemasukan &amp; pengeluaran toko
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href='#'
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                            >
                                <i className="ri-add-line text-lg"></i>
                                <span>Tambah Journal</span>
                            </a>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <i className="ri-arrow-up-circle-line text-emerald-600 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-arrow-up-line"></i>Masuk
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">
                                {formatRupiah(summary.totalPemasukan)}
                            </p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Total Pemasukan</p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                                    <i className="ri-arrow-down-circle-line text-red-500 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-arrow-down-line"></i>Keluar
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">
                                {formatRupiah(summary.totalPengeluaran)}
                            </p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Total Pengeluaran</p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <i className="ri-wallet-3-line text-blue-600 text-xl"></i>
                                </div>
                                <span
                                    className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 ${summary.saldoBersih >= 0
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-red-500 bg-red-50'
                                        }`}
                                >
                                    <i className={summary.saldoBersih >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i>
                                    Bersih
                                </span>
                            </div>
                            <p
                                className={`text-2xl font-extrabold mt-4 ${summary.saldoBersih >= 0 ? 'text-slate-900' : 'text-red-500'
                                    }`}
                            >
                                {summary.saldoBersih >= 0 ? '+ ' : '- '}
                                {formatRupiah(summary.saldoBersih)}
                            </p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Saldo Bersih</p>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex flex-wrap items-end gap-3 px-5 sm:px-6 py-5 border-b border-slate-100">
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
                                    <option value="Pemasukan">Pemasukan</option>
                                    <option value="Pengeluaran">Pengeluaran</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="filter-tanggal" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    Tanggal
                                </label>
                                <input
                                    id="filter-tanggal"
                                    type="date"
                                    value={filterTanggal}
                                    onChange={(e) => setFilterTanggal(e.target.value)}
                                    className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                />
                            </div>

                            <div className="flex flex-col gap-1 flex-1 min-w-[200px] sm:min-w-[240px]">
                                <label htmlFor="filter-search" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    Cari Transaksi
                                </label>
                                <div className="relative">
                                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                    <input
                                        id="filter-search"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari kode atau transaksi..."
                                        className="w-full text-xs font-medium text-slate-600 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 h-[42px] rounded-lg transition-colors">
                                    <i className="ri-file-excel-2-line text-base"></i>
                                    <span>Export Excel</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 h-[42px] rounded-lg transition-colors">
                                    <i className="ri-file-pdf-2-line text-base"></i>
                                    <span>Export PDF</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                                        <th className="px-5 sm:px-6 py-3 font-bold">No</th>
                                        <th className="px-5 py-3 font-bold">Journal</th>
                                        <th className="px-5 py-3 font-bold">Kategori</th>
                                        <th className="px-5 py-3 font-bold">Transaksi</th>
                                        <th className="px-5 py-3 font-bold">Nominal</th>
                                        <th className="px-5 sm:px-6 py-3 font-bold text-left w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                                Tidak ada journal yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                    {paginatedData.map((j, idx) => {
                                        const isPemasukan = j.kategori === 'Pemasukan'
                                        return (
                                            <tr key={j.id} className="hover:bg-slate-50/70">
                                                <td className="px-5 sm:px-6 py-3.5 text-slate-500 font-semibold">
                                                    {(currentPage - 1) * perPage + idx + 1}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <p className="font-bold text-blue-600">{j.kode}</p>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{j.tanggal} &middot; {j.waktu}</p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${KATEGORI_STYLE[j.kategori]}`}>
                                                        {j.kategori}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-600 font-semibold">{j.transaksi}</td>
                                                <td className={`px-5 py-3.5 font-bold ${isPemasukan ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {isPemasukan ? '+ ' : '- '}
                                                    {formatRupiah(j.nominal)}
                                                </td>
                                                <td className="px-5 sm:px-6 py-3.5 w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openDetail(j)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                                            title="Detail"
                                                        >
                                                            <i className="ri-eye-line text-base"></i>
                                                        </button>
                                                        <a href="/karyawan/journal_keuangan/edit" className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600" title="Edit">
                                                            <i className="ri-edit-line text-base"></i>
                                                        </a>
                                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500" title="Hapus">
                                                            <i className="ri-delete-bin-line text-base"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">Tampilkan</span>
                                <select
                                    value={perPage}
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                    className="text-xs font-bold text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span className="text-xs font-semibold text-slate-500">data</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                                >
                                    <i className="ri-arrow-left-s-line"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-500 border border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                                >
                                    <i className="ri-arrow-right-s-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Detail Journal */}
            {detailOpen && detailTrx && (
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
                            <div>
                                <h2 className="font-bold text-slate-800">Detail Journal</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">{detailTrx.kode}</p>
                            </div>
                            <button
                                onClick={closeDetail}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <i className="ri-close-line text-lg"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-5">
                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Tanggal</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{detailTrx.tanggal}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Waktu</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{detailTrx.waktu}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Kategori</p>
                                    <span className={`inline-block mt-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${KATEGORI_STYLE[detailTrx.kategori]}`}>
                                        {detailTrx.kategori}
                                    </span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Transaksi</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{detailTrx.transaksi}</p>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-blue-50 rounded-xl p-3.5 flex gap-2.5">
                                <i className="ri-sticky-note-line text-blue-500 text-lg shrink-0"></i>
                                <div>
                                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Catatan</p>
                                    <p className="text-sm font-medium text-slate-600 mt-0.5">{detailTrx.note}</p>
                                </div>
                            </div>

                            {/* Nominal */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 pt-4">
                                <span className="text-sm font-bold text-slate-800">
                                    {detailTrx.kategori === 'Pemasukan' ? 'Total Pemasukan' : 'Total Pengeluaran'}
                                </span>
                                <span
                                    className={`text-lg font-extrabold ${detailTrx.kategori === 'Pemasukan' ? 'text-emerald-600' : 'text-red-500'
                                        }`}
                                >
                                    {detailTrx.kategori === 'Pemasukan' ? '+ ' : '- '}
                                    {formatRupiah(detailTrx.nominal)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JournalKeuangan