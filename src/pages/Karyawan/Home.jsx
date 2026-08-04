import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import SidebarKaryawan from '../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../components/Navbar/NavbarKaryawan'
import KeripikSingkong from "../../assets/image_product/Keripik_Singkong.png"
import RotiCoklat from "../../assets/image_product/Roti_Coklat.png"
import SirupMarkisa from "../../assets/image_product/Sirup_Markisa.png"

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const salesChartRef = useRef(null)
    const topItemsChartRef = useRef(null)

    const weeklySalesData = [2100000, 2800000, 1950000, 3200000, 4100000, 4850000, 3600000]
    const totalWeeklySales = weeklySalesData.reduce((sum, val) => sum + val, 0)
    const totalWeeklySalesFormatted = (totalWeeklySales / 1000000).toFixed(1) + 'jt'

    // Init charts
    useEffect(() => {
        const salesChart = new Chart(salesChartRef.current, {
            type: 'bar',
            data: {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                datasets: [{
                    label: 'Penjualan',
                    data: weeklySalesData,
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
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="dashboard"
            />

            <div className="lg:pl-72">
                <NavbarKaryawan
                    title="Dashboard"
                    subtitle="Ringkasan performa toko hari ini"
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

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