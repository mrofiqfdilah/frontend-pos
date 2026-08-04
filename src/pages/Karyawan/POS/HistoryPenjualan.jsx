import { useState, useEffect, useMemo } from 'react'
import SidebarKaryawan from '../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../components/Navbar/NavbarKaryawan'

const METODE_LIST = ['Qris', 'Cash', 'Transfer']
const METODE_STYLE = {
    Qris: 'bg-blue-50 text-blue-600',
    Cash: 'bg-emerald-50 text-emerald-600',
    Transfer: 'bg-amber-50 text-amber-600',
}

// Urutan metode diacak manual biar gak berpola Qris-Cash-Transfer terus
const METODE_SEQUENCE = [0, 2, 1, 1, 0, 2, 2, 1, 0, 0, 1, 2, 0, 1, 1, 2, 0, 2, 1, 0]

function generateTransaksi() {
    const data = []
    for (let i = 1; i <= 20; i++) {
        const metode = METODE_LIST[METODE_SEQUENCE[i - 1]]
        const items = (i % 4) + 1
        // Total selalu di atas Rp 200.000
        const total = 200000 + ((i * 37) % 9) * 25000 + items * 5000
        const day = String(((i - 1) % 3) + 1).padStart(2, '0')
        const hour = String(8 + (i % 10)).padStart(2, '0')
        const minute = String((i * 7) % 60).padStart(2, '0')
        data.push({
            id: i,
            kode: `TRANS/${day}0826/${String(i).padStart(2, '0')}`,
            tanggal: `${day} Agu 2026`,
            isoDate: `2026-08-${day}`,
            waktu: `${hour}:${minute}`,
            items,
            metode,
            total,
        })
    }
    // Urutkan dari transaksi paling terbaru (tanggal & waktu terbesar duluan)
    return data.sort((a, b) => `${b.isoDate} ${b.waktu}`.localeCompare(`${a.isoDate} ${a.waktu}`))
}

const formatRupiah = (n) => `Rp ${n.toLocaleString('id-ID')}`

function HistoryPenjualan() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Data & filter state
    const [transaksiList] = useState(generateTransaksi)
    const [search, setSearch] = useState('')
    const [filterMetode, setFilterMetode] = useState('all')
    const [filterTanggal, setFilterTanggal] = useState('')
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    // Filtering
    const filteredData = useMemo(() => {
        return transaksiList.filter((trx) => {
            const matchSearch = trx.kode.toLowerCase().includes(search.toLowerCase())
            const matchMetode = filterMetode === 'all' || trx.metode === filterMetode
            const matchTanggal = !filterTanggal || trx.isoDate === filterTanggal
            return matchSearch && matchMetode && matchTanggal
        })
    }, [transaksiList, search, filterMetode, filterTanggal])

    // Reset ke halaman 1 setiap kali filter/perPage berubah
    useEffect(() => {
        setCurrentPage(1)
    }, [search, filterMetode, filterTanggal, perPage])

    const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage))
    const paginatedData = filteredData.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    )

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="history"
            />

            <div className="lg:pl-72">
                <NavbarKaryawan
                    title="Point of Sale"
                    subtitle="Informasi Transaksi & Penjualan"
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-4">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                                History Penjualan
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Riwayat seluruh transaksi penjualan
                            </p>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Filter + export row */}
                        <div className="flex flex-wrap items-center gap-3 px-5 sm:px-6 py-5 border-b border-slate-100">
                            {/* Filter metode */}
                            <select
                                value={filterMetode}
                                onChange={(e) => setFilterMetode(e.target.value)}
                                className="text-xs font-bold text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                            >
                                <option value="all">Semua Metode</option>
                                <option value="Qris">Qris</option>
                                <option value="Cash">Cash</option>
                                <option value="Transfer">Transfer</option>
                            </select>

                            {/* Filter tanggal */}
                            <input
                                type="date"
                                value={filterTanggal}
                                onChange={(e) => setFilterTanggal(e.target.value)}
                                className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                            />

                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px] sm:min-w-[240px]">
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari kode transaksi..."
                                    className="w-full text-xs font-medium text-slate-600 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 h-[42px]"
                                />
                            </div>

                            {/* Export buttons */}
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

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                                        <th className="px-5 sm:px-6 py-3 font-bold">No</th>
                                        <th className="px-5 py-3 font-bold">Transaksi</th>
                                        <th className="px-5 py-3 font-bold">Items</th>
                                        <th className="px-5 py-3 font-bold">Metode</th>
                                        <th className="px-5 py-3 font-bold">Total</th>
                                        <th className="px-5 sm:px-6 py-3 font-bold text-left w-40">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                                Tidak ada transaksi yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                    {paginatedData.map((trx, idx) => (
                                        <tr key={trx.id} className="hover:bg-slate-50/70">
                                            <td className="px-5 sm:px-6 py-3.5 text-slate-500 font-semibold">
                                                {(currentPage - 1) * perPage + idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="font-bold text-blue-600">{trx.kode}</p>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">{trx.tanggal} &middot; {trx.waktu}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-500 font-medium">{trx.items} item</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${METODE_STYLE[trx.metode]}`}>
                                                    {trx.metode}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-700">{formatRupiah(trx.total)}</td>
                                            <td className="px-5 sm:px-6 py-3.5 w-40">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600" title="Detail">
                                                        <i className="ri-eye-line text-base"></i>
                                                    </button>
                                                    <a href="/karyawan/history_penjualan/edit" className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600" title="Edit">
                                                        <i className="ri-edit-line text-base"></i>
                                                    </a>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Cetak">
                                                        <i className="ri-printer-line text-base"></i>
                                                    </button>
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

                        {/* Pagination */}
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
        </div>
    )
}

export default HistoryPenjualan