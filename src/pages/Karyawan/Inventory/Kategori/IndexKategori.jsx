import { useState } from 'react'
import SidebarKaryawan from '../../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../../components/Navbar/NavbarKaryawan'

// Dummy data kategori
const KATEGORI_LIST = [
    { id: 1, nama: 'Makanan' },
    { id: 2, nama: 'Minuman' },
    { id: 3, nama: 'Snack' },
]

function IndexKategori() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [kategoriList] = useState(KATEGORI_LIST)

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="kategori"
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
                                Data Kategori
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Kelola kategori produk yang tersedia
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href='/karyawan/kategori/add'
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                            >
                                <i className="ri-add-line text-lg"></i>
                                <span>Tambah Kategori</span>
                            </a>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                                        <th className="px-5 sm:px-6 py-3 font-bold">No</th>
                                        <th className="px-5 py-3 font-bold">Nama Kategori</th>
                                        <th className="px-5 sm:px-6 py-3 font-bold text-left w-28">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {kategoriList.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                                Belum ada kategori.
                                            </td>
                                        </tr>
                                    )}
                                    {kategoriList.map((kat, idx) => (
                                        <tr key={kat.id} className="hover:bg-slate-50/70">
                                            <td className="px-5 sm:px-6 py-3.5 text-slate-500 font-semibold">
                                                {idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-700">
                                                {kat.nama}
                                            </td>
                                            <td className="px-5 sm:px-6 py-3.5 w-28">
                                                <div className="flex items-center gap-1">
                                                    <a href='/karyawan/kategori/edit' className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600" title="Edit">
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
        </div>
    )
}

export default IndexKategori