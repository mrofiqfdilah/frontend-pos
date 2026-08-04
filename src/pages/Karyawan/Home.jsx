import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Kasir from './POS/Kasir'
import Logo from '../../assets/web-logo.png'
import KeripikSingkong from "../../assets/image_product/Keripik_Singkong.png"
import RotiCoklat from "../../assets/image_product/Roti_Coklat.png"
import SirupMarkisa from "../../assets/image_product/Sirup_Markisa.png"

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [openMenu, setOpenMenu] = useState(null) // 'menuPOS' | 'menuInv' | 'menuAcc' | null
    const [profileOpen, setProfileOpen] = useState(false)

    const salesChartRef = useRef(null)
    const topItemsChartRef = useRef(null)
    const profileRef = useRef(null)

    const weeklySalesData = [2100000, 2800000, 1950000, 3200000, 4100000, 4850000, 3600000]
    const totalWeeklySales = weeklySalesData.reduce((sum, val) => sum + val, 0)
    const totalWeeklySalesFormatted = (totalWeeklySales / 1000000).toFixed(1) + 'jt'

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

    // Init charts
    useEffect(() => {
        const salesChart = new Chart(salesChartRef.current, {
            type: 'bar',
            data: {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                datasets: [{
                    label: 'Penjualan',
                    data: [2100000, 2800000, 1950000, 3200000, 4100000, 4850000, 3600000],
                    backgroundColor: '#2563EB',
                    borderRadius: 8,
                    maxBarThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => 'Rp ' + ctx.parsed.y.toLocaleString('id-ID')
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: '#F1F5F9' },
                        ticks: {
                            callback: (v) => 'Rp ' + (v / 1000000).toFixed(1) + 'jt',
                            color: '#94A3B8', font: { size: 11 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 11, weight: 600 } }
                    }
                }
            }
        })

        const topItemsChart = new Chart(topItemsChartRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Roti Coklat', 'Sirup Markisa', 'Keripik Singkong', 'Lainnya'],
                datasets: [{
                    data: [32, 24, 19, 25],
                    backgroundColor: ['#2563EB', '#EF4444', '#F59E0B', '#CBD5E1'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 11 },
                        formatter: (value, ctx) => {
                            const label = ctx.chart.data.labels[ctx.dataIndex]
                            return `${label}\n${value}%`
                        },
                        textAlign: 'center'
                    }
                }
            }
        })

        // Cleanup saat komponen unmount (penting supaya chart tidak duplikat)
        return () => {
            salesChart.destroy()
            topItemsChart.destroy()
        }
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
                    <a
                        href="#"
                        className="nav-item active flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600"
                    >
                        <i className="ri-dashboard-3-line nav-icon text-lg text-blue-600"></i>
                        <span>Dashboard</span>
                    </a>

                    {/* Point of Sale */}
                    <div>
                        <button
                            onClick={() => toggleMenu('menuPOS')}
                            className="menu-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-blue-50"
                        >
                            <i className="ri-shopping-basket-2-line nav-icon text-lg text-slate-400"></i>
                            <span>Point Of Sale</span>
                            <i
                                className={`ri-arrow-right-s-line chevron ml-auto text-slate-400 ${openMenu === 'menuPOS' ? 'rotate' : ''
                                    }`}
                            ></i>
                        </button>
                        <div className={`submenu space-y-1 mt-1 ${openMenu === 'menuPOS' ? 'open' : ''}`}>
                            <a
                                href="/karyawan/kasir"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                Kasir
                            </a>
                            <a
                                href="/karyawan/history_penjualan"
                                className="block px-3 py-2 rounded-lg text-sm text-slate-500 font-medium hover:bg-blue-50 hover:text-blue-600"
                            >
                                History Penjualan
                            </a>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div>
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
                    </div>

                    {/* Accounting */}
                    <div>
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
                    </div>
                </nav>

                {/* Bottom help card */}
                <div className="p-4 shrink-0">
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                        <i className="ri-customer-service-2-line text-blue-600 text-2xl"></i>
                        <p className="text-xs font-semibold text-slate-700 mt-2">Butuh bantuan?</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Hubungi tim support kami</p>
                    </div>
                </div>
            </aside>

            {/* Main wrapper */}
            <div className="lg:pl-72">
                {/* Topbar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 h-20 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <i className="ri-menu-line text-2xl"></i>
                    </button>

                    <div>
                        <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-xs text-slate-400 font-medium hidden sm:block">
                            Ringkasan performa toko hari ini
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
                </header>

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <i className="ri-archive-stack-line text-blue-600 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-arrow-up-line"></i>4.2%
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">248</p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Total Item</p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <i className="ri-team-line text-emerald-600 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-checkbox-circle-line"></i>Aktif
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">12</p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Karyawan Aktif</p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <i className="ri-money-dollar-circle-line text-amber-600 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-arrow-up-line"></i>12%
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">Rp 4.850.000</p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Penjualan Hari Ini</p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                                    <i className="ri-receipt-line text-red-500 text-xl"></i>
                                </div>
                                <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <i className="ri-arrow-down-line"></i>2.1%
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900 mt-4">87</p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Total Transaksi Hari Ini</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="font-bold text-slate-800">Penjualan Mingguan</h2>
                                    <p className="text-xs text-slate-400 font-medium">7 hari terakhir</p>
                                </div>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                    Rp {totalWeeklySalesFormatted}
                                </span>
                            </div>
                            <div className="h-64 sm:h-72">
                                <canvas ref={salesChartRef}></canvas>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                            <div className="mb-2">
                                <h2 className="font-bold text-slate-800">Barang Terlaris</h2>
                                <p className="text-xs text-slate-400 font-medium">Berdasarkan unit terjual</p>
                            </div>
                            <div className="h-56 flex items-center justify-center">
                                <canvas ref={topItemsChartRef}></canvas>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                    <span className="text-slate-500 font-medium">Roti Coklat</span>
                                    <span className="ml-auto font-bold text-slate-700">32%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span className="text-slate-500 font-medium">Sirup Markisa</span>
                                    <span className="ml-auto font-bold text-slate-700">24%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    <span className="text-slate-500 font-medium">Keripik Singkong</span>
                                    <span className="ml-auto font-bold text-slate-700">19%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                                    <span className="text-slate-500 font-medium">Lainnya</span>
                                    <span className="ml-auto font-bold text-slate-700">25%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent items table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">Item Terlaris Hari Ini</h2>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Semua
                            </a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                                        <th className="px-5 sm:px-6 py-3 font-bold">Nama Produk</th>
                                        <th className="px-5 py-3 font-bold">Kategori</th>
                                        <th className="px-5 py-3 font-bold">Terjual</th>
                                        <th className="px-5 py-3 font-bold">Stok</th>
                                        <th className="px-5 sm:px-6 py-3 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50/70">
                                        <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-700 flex items-center gap-2.5">
                                            <img
                                                src={RotiCoklat}
                                                alt="Roti Coklat"
                                                className="w-15 h-15 rounded-lg object-cover"
                                            />
                                            Roti Coklat
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                                Makanan
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">142 pcs</td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">36</td>
                                        <td className="px-5 sm:px-6 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
                                                Menipis
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-slate-50/70">
                                        <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-700 flex items-center gap-2.5">
                                            <img
                                                src={SirupMarkisa}
                                                alt="Sirup Markisa"
                                                className="w-15 h-15 rounded-lg object-cover"
                                            />
                                            Sirup Markisa
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                                                Minuman
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">64 pcs</td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">0</td>
                                        <td className="px-5 sm:px-6 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                                                Habis
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-slate-50/70">
                                        <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-700 flex items-center gap-2.5">
                                            <img
                                                src={KeripikSingkong}
                                                alt="Keripik Singkong"
                                                className="w-15 h-15 rounded-lg object-cover"
                                            />
                                            Keripik Singkong
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600">
                                                Snack
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">96 pcs</td>
                                        <td className="px-5 py-3.5 text-slate-500 font-medium">58</td>
                                        <td className="px-5 sm:px-6 py-3.5">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                                Tersedia
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Home