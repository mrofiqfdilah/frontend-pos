import { useState } from 'react'

const MENU_POS = [
    { href: '/karyawan/kasir', label: 'Kasir', key: 'kasir' },
    { href: '/karyawan/history_penjualan', label: 'History Penjualan', key: 'history' },
]

const MENU_INV = [
    { href: '/karyawan/kategori', label: 'Kategori', key: 'kategori' },
    { href: '#', label: 'Item', key: 'item' },
    { href: '#', label: 'Rak', key: 'rak' },
]

const MENU_ACC = [
    { href: '#', label: 'Laporan Keuntungan', key: 'laporan-keuntungan' },
    { href: '#', label: 'Laporan Item', key: 'laporan-item' },
]

function SidebarKaryawan({ sidebarOpen, onClose, active = 'dashboard' }) {
    // Submenu default terbuka mengikuti halaman aktif
    const defaultOpen = MENU_POS.some((m) => m.key === active)
        ? 'menuPOS'
        : MENU_INV.some((m) => m.key === active)
            ? 'menuInv'
            : MENU_ACC.some((m) => m.key === active)
                ? 'menuAcc'
                : null

    const [openMenu, setOpenMenu] = useState(defaultOpen)

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu))
    }

    return (
        <>
            {/* Mobile overlay */}
            <div
                onClick={onClose}
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
                        onClick={onClose}
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
                        className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 ${active === 'dashboard' ? 'active' : ''
                            }`}
                    >
                        <i className={`ri-dashboard-3-line nav-icon text-lg ${active === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}></i>
                        <span>Dashboard</span>
                    </a>

                    {/* Point of Sale */}
                    <div>
                        <button
                            onClick={() => toggleMenu('menuPOS')}
                            className={`nav-item menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50 ${defaultOpen === 'menuPOS' ? 'active' : ''
                                }`}
                        >
                            <i className={`ri-shopping-basket-2-line nav-icon text-lg ${defaultOpen === 'menuPOS' ? 'text-blue-600' : 'text-slate-400'}`}></i>
                            <span>Point Of Sale</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto ${defaultOpen === 'menuPOS' ? 'text-white' : 'text-slate-400'} ${openMenu === 'menuPOS' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuPOS' ? 'open' : ''}`}>
                            {MENU_POS.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 ${active === item.key ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Inventory */}
                    <div>
                        <button
                            onClick={() => toggleMenu('menuInv')}
                            className={`nav-item menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50 ${defaultOpen === 'menuInv' ? 'active' : ''
                                }`}
                        >
                            <i className={`ri-archive-2-line nav-icon text-lg ${defaultOpen === 'menuInv' ? 'text-blue-600' : 'text-slate-400'}`}></i>
                            <span>Inventory</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto ${defaultOpen === 'menuInv' ? 'text-white' : 'text-slate-400'} ${openMenu === 'menuInv' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuInv' ? 'open' : ''}`}>
                            {MENU_INV.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 ${active === item.key ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

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
                            {MENU_ACC.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 ${active === item.key ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))
                            }
                        </div >
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
        </>
    )
}

export default SidebarKaryawan