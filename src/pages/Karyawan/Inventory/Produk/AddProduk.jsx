import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarKaryawan from '../../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../../components/Navbar/NavbarKaryawan'

const KATEGORI_LIST = ['Makanan', 'Minuman', 'Snack']
const PENITIP_LIST = ['Toko Andi', 'Toko Miya']

const FORM_AWAL = {
    nama: '',
    kategori: KATEGORI_LIST[0],
    kepemilikan: 'Pribadi',
    penitip: PENITIP_LIST[0],
    komisi: '',
    stok: '',
    harga: '',
}

const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

// Style dasar dipakai berulang, disatukan di sini biar semua input konsisten
const LABEL_CLS = 'text-[11px] font-bold text-slate-400 uppercase tracking-wide'
const INPUT_CLS =
    'w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-shadow'

function AddProduk() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [form, setForm] = useState(FORM_AWAL)
    const [error, setError] = useState('')
    const [foto, setFoto] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const updateForm = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    const handleFotoChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran gambar maksimal 5MB.')
            return
        }

        setFoto(file)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(URL.createObjectURL(file))
        if (error) setError('')
    }

    const handleRemoveFoto = (e) => {
        e.stopPropagation()
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setFoto(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Nominal yang harus dibayar ke penitip = harga jual - komisi kita
    const uangKePenitip =
        form.kepemilikan === 'Titipan' && form.harga && form.komisi
            ? Math.max(0, Number(form.harga) - Number(form.komisi))
            : null

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form.nama.trim()) {
            setError('Nama produk tidak boleh kosong.')
            return
        }
        if (!form.stok || Number(form.stok) < 0) {
            setError('Stok harus diisi dengan angka yang valid.')
            return
        }
        if (!form.harga || Number(form.harga) <= 0) {
            setError('Harga jual harus diisi dengan angka yang valid.')
            return
        }
        if (form.kepemilikan === 'Titipan') {
            if (!form.komisi || Number(form.komisi) < 0) {
                setError('Komisi harus diisi dengan angka yang valid.')
                return
            }
            if (Number(form.komisi) > Number(form.harga)) {
                setError('Komisi tidak boleh lebih besar dari harga jual.')
                return
            }
        }

        console.log('Produk baru:', { ...form, foto })

        navigate('/karyawan/produk')
    }

    const handleReset = () => {
        setForm(FORM_AWAL)
        setError('')
        handleRemoveFoto({ stopPropagation: () => { } })
    }

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
                                Tambah Produk
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Tambahkan produk baru ke inventory
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/karyawan/produk')}
                            className="flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
                        >
                            <i className="ri-arrow-left-s-line text-lg"></i>
                            <span>Kembali</span>
                        </button>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Nama Produk */}
                            <div>
                                <label className={LABEL_CLS}>Nama Produk</label>
                                <input
                                    type="text"
                                    value={form.nama}
                                    onChange={(e) => updateForm('nama', e.target.value)}
                                    placeholder="Contoh: Keripik Singkong"
                                    className={INPUT_CLS}
                                />
                            </div>

                            {/* Kategori & Kepemilikan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL_CLS}>Kategori</label>
                                    <select
                                        value={form.kategori}
                                        onChange={(e) => updateForm('kategori', e.target.value)}
                                        className={`${INPUT_CLS} cursor-pointer`}
                                    >
                                        {KATEGORI_LIST.map((kat) => (
                                            <option key={kat} value={kat}>{kat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={LABEL_CLS}>Kepemilikan</label>
                                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                                        {['Pribadi', 'Titipan'].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => updateForm('kepemilikan', opt)}
                                                className={`flex items-center justify-center gap-1.5 border-2 rounded-xl py-3 text-sm font-bold transition-colors ${form.kepemilikan === opt
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                    }`}
                                            >
                                                <i className={opt === 'Titipan' ? 'ri-store-2-line' : 'ri-user-line'}></i>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Info titipan — hanya tampil kalau kepemilikan Titipan */}
                            {form.kepemilikan === 'Titipan' && (
                                <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-store-2-line text-emerald-600"></i>
                                        <span className="text-sm font-bold text-emerald-800">
                                            Informasi Titipan
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                                                Penitip
                                            </label>
                                            <select
                                                value={form.penitip}
                                                onChange={(e) => updateForm('penitip', e.target.value)}
                                                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                                            >
                                                {PENITIP_LIST.map((p) => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                                                Komisi (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.komisi}
                                                onChange={(e) => updateForm('komisi', e.target.value)}
                                                placeholder="Contoh: 5000"
                                                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-emerald-600 font-medium -mt-1">
                                        <i className="ri-information-line"> </i> Komisi adalah bagian yang kita dapat per barang laku. Sisanya (harga jual − komisi) akan dibayarkan ke {form.penitip}.
                                    </p>

                                    {uangKePenitip !== null && (
                                        <div className="flex items-center justify-between bg-white rounded-lg px-3.5 py-2.5 border border-emerald-200">
                                            <span className="text-xs font-bold text-emerald-700">
                                                Dibayar ke {form.penitip} / item
                                            </span>
                                            <span className="text-sm font-extrabold text-emerald-800">
                                                {formatRupiah(uangKePenitip)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stok & Harga */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL_CLS}>Stok</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stok}
                                        onChange={(e) => updateForm('stok', e.target.value)}
                                        placeholder="Contoh: 24"
                                        className={INPUT_CLS}
                                    />
                                </div>

                                <div>
                                    <label className={LABEL_CLS}>Harga Jual (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.harga}
                                        onChange={(e) => updateForm('harga', e.target.value)}
                                        placeholder="Contoh: 15000"
                                        className={INPUT_CLS}
                                    />
                                </div>
                            </div>

                            {/* Foto Produk */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFotoChange}
                                className="hidden"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Dropzone — selalu bisa diklik untuk ganti foto */}
                                <div>
                                    <label className={LABEL_CLS}>Foto Produk</label>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full mt-1.5 h-64 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex flex-col items-center justify-center gap-2.5 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        <i className="ri-upload-2-line text-3xl"></i>
                                        <span className="text-sm font-bold text-slate-700">Klik untuk upload foto</span>
                                        <span className="text-xs text-slate-400">PNG, JPG atau WEBP (Max: 5MB)</span>
                                    </button>
                                </div>

                                {/* Preview */}
                                <div>
                                    <label className={LABEL_CLS}>Preview</label>
                                    <div className="relative mt-1.5 h-64 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                                        {previewUrl ? (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview produk"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFoto}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-red-500 flex items-center justify-center shadow-sm"
                                                    aria-label="Hapus foto"
                                                >
                                                    <i className="ri-close-line text-base"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <i className="ri-image-line text-3xl text-slate-300"></i>
                                        )}
                                    </div>
                                    {foto && (
                                        <p className="text-[11px] text-slate-400 font-medium truncate mt-1.5">
                                            {foto.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                                    {error}
                                </p>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                                >
                                    <i className="ri-save-line"></i>
                                    <span>Simpan</span>
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

                    {/* Note kode produk otomatis */}
                    <div className="flex items-start gap-2.5 px-1">
                        <i className="ri-information-line text-slate-400 text-base mt-[-4px]"></i>
                        <p className="text-xs text-slate-400 font-medium">
                            Kode produk akan dibuat secara otomatis oleh sistem setelah data disimpan.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AddProduk