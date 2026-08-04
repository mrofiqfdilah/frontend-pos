import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarKaryawan from '../../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../../components/Navbar/NavbarKaryawan'

const NAMA_AWAL = 'Makanan'

function EditKategori() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [nama, setNama] = useState(NAMA_AWAL)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!nama.trim()) {
            setError('Nama kategori tidak boleh kosong.')
            return
        }

        console.log('Update kategori ->', nama.trim())

        navigate('/karyawan/kategori')
    }

    // Reset mengembalikan ke value bawaan (bukan dikosongkan, karena ini form edit)
    const handleReset = () => {
        setNama(NAMA_AWAL)
        setError('')
    }

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
                                Edit Kategori
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Ubah nama kategori produk
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/karyawan/kategori')}
                            className="flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
                        >
                            <i className="ri-arrow-left-s-line text-lg"></i>
                            <span>Kembali</span>
                        </button>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={nama}
                                    onChange={(e) => {
                                        setNama(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="Contoh: Makanan"
                                    className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${error ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                />
                                {error && (
                                    <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                                >
                                    <i className="ri-save-line"></i>
                                    <span>Simpan Perubahan</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    <i className="ri-refresh-line"></i>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default EditKategori