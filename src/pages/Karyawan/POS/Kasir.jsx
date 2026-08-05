import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import KeripikSingkong from "../../../assets/image_product/Keripik_Singkong.png"
import RotiCoklat from "../../../assets/image_product/Roti_Coklat.png"
import SirupMarkisa from "../../../assets/image_product/Sirup_Markisa.png"

const CATEGORY_STYLE = {
    Makanan: { badge: 'bg-emerald-50 text-emerald-600', icon: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    Minuman: { badge: 'bg-red-50 text-red-500', icon: 'text-red-500', iconBg: 'bg-red-50' },
    Snack: { badge: 'bg-amber-50 text-amber-600', icon: 'text-amber-600', iconBg: 'bg-amber-50' },
}

const CAT_ACTIVE_CLASS = {
    Makanan: 'border-emerald-600 bg-emerald-600 text-white',
    Minuman: 'border-red-500 bg-red-500 text-white',
    Snack: 'border-amber-500 bg-amber-500 text-white',
}

const CAT_INACTIVE_TEXT = {
    Makanan: 'text-emerald-600',
    Minuman: 'text-red-500',
    Snack: 'text-amber-600',
}

const products = [
    { id: 'p1', name: 'Roti Coklat', code: 'Itm/2026/7/0001', category: 'Makanan', price: 15000, stock: 36, image: RotiCoklat },
    { id: 'p9', name: 'Sirup Markisa', code: 'Itm/2026/7/0009', category: 'Minuman', price: 22000, stock: 18, image: SirupMarkisa },
    { id: 'p5', name: 'Keripik Singkong', code: 'Itm/2026/7/0005', category: 'Snack', price: 12000, stock: 58, image: KeripikSingkong },
]

const rupiah = (n) => 'Rp ' + Math.max(0, Math.round(n)).toLocaleString('id-ID')

function Kasir() {
    const navigate = useNavigate()

    const [search, setSearch] = useState('')
    const [selectedCats, setSelectedCats] = useState(new Set()) // empty = show all
    const [cart, setCart] = useState({}) // id -> qty
    const [payMethod, setPayMethod] = useState('cash')
    const [cashValue, setCashValue] = useState('')

    // Toggle kategori filter
    const toggleCategory = (cat) => {
        setSelectedCats((prev) => {
            const next = new Set(prev)
            if (cat === 'all') {
                next.clear()
            } else if (next.has(cat)) {
                next.delete(cat)
            } else {
                next.add(cat)
            }
            return next
        })
    }

    // Produk yang sudah difilter (search + kategori)
    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase()
        return products
            .filter((p) => !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
            .filter((p) => selectedCats.size === 0 || selectedCats.has(p.category))
    }, [search, selectedCats])

    const addToCart = (id) => {
        const p = products.find((x) => x.id === id)
        setCart((prev) => {
            const current = prev[id] || 0
            if (current >= p.stock) return prev
            return { ...prev, [id]: current + 1 }
        })
    }

    const changeQty = (id, delta) => {
        const p = products.find((x) => x.id === id)
        setCart((prev) => {
            const next = (prev[id] || 0) + delta
            const copy = { ...prev }
            if (next <= 0) {
                delete copy[id]
            } else if (next <= p.stock) {
                copy[id] = next
            }
            return copy
        })
    }

    const removeItem = (id) => {
        setCart((prev) => {
            const copy = { ...prev }
            delete copy[id]
            return copy
        })
    }

    const clearCart = () => setCart({})

    const cartIds = Object.keys(cart)
    const totalItemCount = cartIds.reduce((s, id) => s + cart[id], 0)
    const subtotal = cartIds.reduce((s, id) => s + cart[id] * products.find((x) => x.id === id).price, 0)
    const cash = Number(cashValue) || 0
    const change = cash - subtotal
    const canPay = cartIds.length > 0 && cash >= subtotal

    const handlePay = () => {
        if (!canPay) return
        alert('Pembayaran berhasil diproses!')
        setCart({})
        setCashValue('')
    }

    return (
        <div className="min-h-screen text-slate-800 bg-[#f4f5f8]">
            <style>{`
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
            `}</style>
            <div className="max-w-[1600px] mx-auto">
                {/* Top bar */}
                <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blue-100 shadow-sm text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                        <i className="ri-arrow-left-s-line text-lg"></i>
                        <span>Kembali</span>
                    </button>

                    <div className="flex items-center gap-1.5 bg-blue-600 px-3.5 py-2 rounded-full shadow-sm shadow-blue-200">
                        <i className="ri-map-pin-2-fill text-white text-base"></i>
                        <span className="text-sm font-bold text-white">Outlet Sampit</span>
                    </div>
                </div>

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
                        {/* LEFT: search + product grid */}
                        <div className="space-y-4 min-w-0">
                            <div className="relative flex items-center border-2 border-blue-500 rounded-2xl bg-white focus-within:ring-4 focus-within:ring-blue-100">
                                <i className="ri-barcode-line pl-4 text-blue-400 text-lg"></i>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Scan barcode atau ketik nama/kode item, lalu tekan Enter..."
                                    className="flex-1 min-w-0 pl-3 pr-2 py-3.5 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
                                />
                                <button className="shrink-0 w-12 h-[48px] mr-1 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-50">
                                    <i className="ri-search-line text-lg"></i>
                                </button>
                            </div>

                            {/* Category chips */}
                            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                                <button
                                    onClick={() => toggleCategory('all')}
                                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-2 transition-colors ${selectedCats.size === 0
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-white bg-white text-slate-500'
                                        }`}
                                >
                                    <i className="ri-apps-2-line"></i> Semua
                                </button>
                                {Object.keys(CATEGORY_STYLE).map((cat) => {
                                    const isActive = selectedCats.has(cat)
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-2 transition-colors ${isActive
                                                ? CAT_ACTIVE_CLASS[cat]
                                                : `border-white bg-white ${CAT_INACTIVE_TEXT[cat]}`
                                                }`}
                                        >
                                            <i
                                                className={
                                                    cat === 'Makanan'
                                                        ? 'ri-cake-3-line'
                                                        : cat === 'Minuman'
                                                            ? 'ri-cup-line'
                                                            : 'ri-leaf-line'
                                                }
                                            ></i>{' '}
                                            {cat}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Product grid */}
                            <div className="no-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[calc(100vh-17rem)] overflow-y-auto overflow-x-visible pt-6 pr-1 pb-2">
                                {filteredProducts.map((p) => {
                                    const style = CATEGORY_STYLE[p.category]
                                    const out = p.stock <= 0
                                    const qty = cart[p.id] || 0
                                    return (
                                        <button
                                            key={p.id}
                                            disabled={out}
                                            onClick={() => !out && addToCart(p.id)}
                                            className={`product-card relative bg-white rounded-2xl border border-blue-50 p-3 text-left hover:border-blue-300 hover:shadow-md ${out ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {qty > 0 && (
                                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow ring-2 ring-white z-10">
                                                    {qty}
                                                </div>
                                            )}
                                            <div className={`w-full aspect-square rounded-xl ${style.iconBg} overflow-hidden mb-3`}>
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="font-bold text-sm text-slate-800 truncate">{p.name}</p>
                                            <span className={`text-[11px] font-bold ${style.icon}`}>{p.category}</span>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1">{p.code}</p>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-sm font-extrabold text-slate-900">{rupiah(p.price)}</span>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${out ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                                                        }`}
                                                >
                                                    {out ? 'Habis' : 'Stok ' + p.stock}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* RIGHT: cart */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-100 p-5 h-fit lg:sticky lg:top-6 flex flex-col">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-extrabold text-slate-900">Keranjang Belanja</h2>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{totalItemCount} item</p>
                                </div>
                                <button
                                    onClick={clearCart}
                                    className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600"
                                >
                                    <i className="ri-delete-bin-6-line"></i> Kosongkan
                                </button>
                            </div>

                            <div className="no-scrollbar mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-1">
                                {cartIds.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-10">
                                        <i className="ri-shopping-cart-2-line text-4xl text-blue-200"></i>
                                        <p className="text-sm text-slate-400 font-semibold mt-3">Belum ada item.</p>
                                        <p className="text-xs text-slate-400">Scan barcode atau klik item di kiri.</p>
                                    </div>
                                ) : (
                                    cartIds.map((id) => {
                                        const p = products.find((x) => x.id === id)
                                        const qty = cart[id]
                                        const style = CATEGORY_STYLE[p.category]
                                        return (
                                            <div key={id} className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg ${style.iconBg} overflow-hidden shrink-0`}>
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-700 truncate">{p.name}</p>
                                                    <p className="text-xs text-slate-400 font-semibold">{rupiah(p.price)}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => changeQty(id, -1)}
                                                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-5 text-center text-sm font-bold text-slate-700">{qty}</span>
                                                    <button
                                                        onClick={() => changeQty(id, 1)}
                                                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(id)}
                                                    className="text-slate-300 hover:text-red-500 shrink-0"
                                                >
                                                    <i className="ri-close-circle-fill text-lg"></i>
                                                </button>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            <div className="border-t border-slate-100 mt-4 pt-4 space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-semibold">Subtotal</span>
                                    <span className="font-bold text-slate-800">{rupiah(subtotal)}</span>
                                </div>
                                <button className="text-xs font-bold text-blue-600 hover:underline">+ Tambah Diskon</button>
                            </div>

                            <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between bg-blue-50 -mx-5 px-5 py-3 rounded-b-none">
                                <span className="font-extrabold text-slate-900">TOTAL</span>
                                <span className="font-extrabold text-xl text-green-600">{rupiah(subtotal)}</span>
                            </div>

                            {/* Payment method */}
                            <div className="mt-4">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Metode Pembayaran
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'cash', label: 'Cash', icon: 'ri-cash-line' },
                                        { key: 'qris', label: 'QRIS', icon: 'ri-qr-code-line' },
                                        { key: 'transfer', label: 'Transfer', icon: 'ri-bank-line' },
                                    ].map((m) => (
                                        <button
                                            key={m.key}
                                            onClick={() => setPayMethod(m.key)}
                                            className={`flex flex-col items-center gap-1 border-2 rounded-xl py-2.5 text-xs font-bold transition-colors ${payMethod === m.key
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-slate-200 text-slate-500'
                                                }`}
                                        >
                                            <i
                                                className={`${m.icon} text-lg ${payMethod === m.key ? 'text-blue-600' : 'text-slate-400'
                                                    }`}
                                            ></i>{' '}
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cash input */}
                            <div className="mt-4">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                    Uang Diterima (Rp)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={cashValue}
                                    onChange={(e) => setCashValue(e.target.value)}
                                    placeholder="0"
                                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                />
                                <div className="flex items-center justify-between mt-2 text-sm">
                                    <span className="text-slate-500 font-semibold">Kembalian</span>
                                    <span className={`font-extrabold ${change < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {rupiah(change)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!canPay}
                                className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-2xl shadow-sm shadow-blue-200 transition-colors"
                            >
                                <i className="ri-checkbox-circle-line"></i> Proses Pembayaran
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Kasir