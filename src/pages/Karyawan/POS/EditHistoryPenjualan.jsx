import { useState, useEffect, useRef, useMemo } from 'react'
import Kasir from './Kasir'
import Logo from '../../../assets/web-logo.png'

function EditHistoryPenjualan() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [openMenu, setOpenMenu] = useState(null) // 'menuPOS' | 'menuInv' | 'menuAcc' | null
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

    // Data & filter state

    // Toggle submenu accordion
    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu))
    }

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])


    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            {/* Mobile overlay */}
            <div
                onClick={() => setSidebarOpen(false)}
                className={`fixed inset-0 bg-slate-900/50 z-30 transition-opacity duration-200 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                        <i className="ri-shopping-basket-fill text-white text-2xl"></i>
                    </div>
                    <div className="leading-tight">
                        <p className="font-extrabold text-slate-900 text-base tracking-tight">POS Systems</p>
                        <p className="text-[11px] text-slate-400 font-medium">Panel Karyawan</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                {/* Nav */}
                <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
                    <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Menu Utama
                    </p>

                    {/* Dashboard */}
                    <a href="/karyawan/home"
                        className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600"
                    >
                        <i className="ri-dashboard-3-line nav-icon text-lg text-slate-400"></i>
                        <span>Dashboard</span>
                    </a>

                    {/* Point of Sale */}
                    <div>
                        <button
                            onClick={() => toggleMenu('menuPOS')}
                            className="nav-item active menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50"
                        >
                            <i className="ri-shopping-basket-2-line nav-icon text-lg text-blue-600"></i>
                            <span>Point Of Sale</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto text-white ${openMenu === 'menuPOS' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuPOS' ? 'open' : ''}`}>

                            <a href="/karyawan/kasir"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Kasir
                            </a>

                            <a href="/karyawan/history_penjualan"
                                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 bg-blue-50 text-blue-600"
                            >
                                History Penjualan
                            </a>
                        </div>
                    </div >

                    {/* Inventory */}
                    < div >
                        <button
                            onClick={() => toggleMenu('menuInv')}
                            className="menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50"
                        >
                            <i className="ri-archive-2-line nav-icon text-lg text-slate-400"></i>
                            <span>Inventory</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto text-slate-400 ${openMenu === 'menuInv' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuInv' ? 'open' : ''}`}>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Kategori
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Item
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Rak
                            </a>
                        </div>
                    </div >

                    {/* Accounting */}
                    < div >
                        <button
                            onClick={() => toggleMenu('menuAcc')}
                            className="menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50"
                        >
                            <i className="ri-file-chart-2-line nav-icon text-lg text-slate-400"></i>
                            <span>Accounting</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto text-slate-400 ${openMenu === 'menuAcc' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuAcc' ? 'open' : ''}`}>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Laporan Keuntungan
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Laporan Item
                            </a>
                        </div>
                    </div >
                </nav >

                {/* Bottom help card */}
                < div className="p-4 shrink-0" >
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                        <i className="ri-customer-service-2-line text-blue-600 text-2xl"></i>
                        <p className="text-xs font-semibold text-slate-700 mt-2">Butuh bantuan?</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Hubungi tim support kami</p>
                    </div>
                </div >
            </aside >

            {/* Main wrapper */}
            < div className="lg:pl-72" >
                {/* Topbar */}
                < header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 h-20 flex items-center px-4 sm:px-6 lg:px-8 gap-4" >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <i className="ri-menu-line text-2xl"></i>
                    </button>

                    <div>
                        <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                            Point of Sale
                        </h1>
                        <p className="text-xs text-slate-400 font-medium hidden sm:block">
                            Informasi Transaksi & Penjualan
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        {/* Quick action: Buka Kasir */}
                        <a
                            href="/karyawan/kasir"
                            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold pl-3.5 pr-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                        >
                            <i className="ri-shopping-cart-2-line text-base"></i>
                            <span>Buka Kasir</span>
                        </a>
                        <a
                            href="/karyawan/kasir"
                            className="sm:hidden w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm shadow-blue-200"
                        >
                            <i className="ri-shopping-cart-2-line text-lg"></i>
                        </a>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setProfileOpen((prev) => !prev)
                                }}
                                className="flex items-center gap-2.5 pl-1.5 pr-1 sm:pr-3 py-1 rounded-full"
                            >
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
                                    alt="Budi"
                                    className="w-9 h-9 rounded-full bg-blue-100 object-cover"
                                />
                                <span className="hidden sm:block text-sm font-bold text-slate-700">Budi</span>
                                <i className="ri-arrow-down-s-line hidden sm:block text-slate-400"></i>
                            </button>

                            <div
                                className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-150 ${profileOpen
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 -translate-y-1 pointer-events-none'
                                    }`}
                            >
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
                                        className="w-10 h-10 rounded-full bg-blue-100"
                                        alt="Profile"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Budi Santoso</p>
                                        <p className="text-xs text-slate-400">Kasir &middot; Shift Pagi</p>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    <i className="ri-user-3-line text-slate-400"></i> Profil Saya
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    <i className="ri-settings-3-line text-slate-400"></i> Pengaturan
                                </a>
                                <div className="border-t border-slate-100"></div>
                                <a
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                                >
                                    <i className="ri-logout-box-r-line"></i> Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </header >

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-4">
                    {/* Title row: History Penjualan (kiri) + Tambah Transaksi + Ubah (kanan) */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                                Edit History Penjualan
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Edit jika terjadi Kesalahan transaksi di kasir
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href='/karyawan/history_penjualan/tambah'
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors"
                            >
                                <i className="ri-add-line text-lg"></i>
                                <span>Update Transaksi</span>
                            </a>

                        </div>

                    </div>
                </main>
            </div >
        </div >
    )
}

export default EditHistoryPenjualan