import { useState, useEffect, useRef, useMemo } from 'react'
import Chart from 'chart.js/auto'
import SidebarKaryawan from '../../../components/Sidebar/SidebarKaryawan'
import NavbarKaryawan from '../../../components/Navbar/NavbarKaryawan'

const PERIOD_TABS = [
    { key: 'harian', label: 'Harian' },
    { key: 'mingguan', label: 'Mingguan' },
    { key: 'bulanan', label: 'Bulanan' },
    { key: 'tahunan', label: 'Tahunan' },
]

const PERIOD_SUBTITLE = {
    harian: '7 hari terakhir',
    mingguan: '12 minggu terakhir',
    bulanan: '12 bulan terakhir',
    tahunan: '5 tahun terakhir',
}

// Format angka jadi ringkas: 1.2jt / 850rb / dst
const formatCompact = (value) => {
    const abs = Math.abs(value)
    const sign = value < 0 ? '-' : ''
    if (abs >= 1_000_000_000) return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1)}M`
    if (abs >= 1_000_000) return `${sign}Rp ${(abs / 1_000_000).toFixed(1)}jt`
    if (abs >= 1_000) return `${sign}Rp ${(abs / 1_000).toFixed(0)}rb`
    return `${sign}Rp ${abs}`
}

const formatRupiah = (value) => `Rp ${Math.abs(value).toLocaleString('id-ID')}`

// ==== Dummy data generator per periode (ganti dengan data dari API) ====
function generateTrendData(periode) {
    const config = {
        harian: { count: 7, genLabel: (i) => ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i] },
        mingguan: { count: 12, genLabel: (i) => `M${i + 1}` },
        bulanan: { count: 12, genLabel: (i) => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'][i] },
        tahunan: { count: 5, genLabel: (i) => `${2022 + i}` },
    }
    const { count, genLabel } = config[periode]

    const labels = []
    const pemasukan = []
    const pengeluaran = []
    const saldoBersih = []

    for (let i = 0; i < count; i++) {
        labels.push(genLabel(i))
        const inflow = 500000 + ((i * 137) % 9) * 350000
        const outflow = 300000 + ((i * 271) % 11) * 420000
        pemasukan.push(inflow)
        pengeluaran.push(outflow)
        saldoBersih.push(inflow - outflow)
    }

    return { labels, pemasukan, pengeluaran, saldoBersih }
}

function ReportKeuangan() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [periode, setPeriode] = useState('mingguan')
    const trendChartRef = useRef(null)
    const compositionChartRef = useRef(null)

    const trendData = useMemo(() => generateTrendData(periode), [periode])

    const composition = useMemo(() => {
        const totalPemasukan = trendData.pemasukan.reduce((a, b) => a + b, 0)
        const totalPengeluaran = trendData.pengeluaran.reduce((a, b) => a + b, 0)
        return { totalPemasukan, totalPengeluaran }
    }, [trendData])

    useEffect(() => {
        const trendChart = new Chart(trendChartRef.current, {
            data: {
                labels: trendData.labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Pemasukan',
                        data: trendData.pemasukan,
                        backgroundColor: '#10B981',
                        borderRadius: 6,
                        maxBarThickness: 22,
                        yAxisID: 'y1',
                        order: 2,
                    },
                    {
                        type: 'bar',
                        label: 'Pengeluaran',
                        data: trendData.pengeluaran,
                        backgroundColor: '#EF4444',
                        borderRadius: 6,
                        maxBarThickness: 22,
                        yAxisID: 'y1',
                        order: 2,
                    },
                    {
                        type: 'line',
                        label: 'Saldo Bersih',
                        data: trendData.saldoBersih,
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#2563EB',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2.5,
                        tension: 0.35,
                        fill: true,
                        yAxisID: 'y',
                        order: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            padding: 16,
                            color: '#475569',
                            font: { size: 12, weight: 600 },
                        },
                    },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        padding: 10,
                        cornerRadius: 8,
                        titleFont: { size: 12, weight: 700 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y)}`,
                        },
                    },
                },
                scales: {
                    y: {
                        position: 'left',
                        grid: { color: '#F1F5F9' },
                        ticks: {
                            callback: (v) => formatCompact(v),
                            color: '#2563EB',
                            font: { size: 11, weight: 600 },
                        },
                        title: {
                            display: true,
                            text: 'Saldo Bersih',
                            color: '#94A3B8',
                            font: { size: 10, weight: 700 },
                        },
                    },
                    y1: {
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: {
                            callback: (v) => formatCompact(v),
                            color: '#94A3B8',
                            font: { size: 11 },
                        },
                        title: {
                            display: true,
                            text: 'Pemasukan / Pengeluaran',
                            color: '#94A3B8',
                            font: { size: 10, weight: 700 },
                        },
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#94A3B8',
                            font: { size: 11, weight: 600 },
                            maxRotation: 0,
                            autoSkip: true,
                        },
                    },
                },
            },
        })

        const compositionChart = new Chart(compositionChartRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Pemasukan', 'Pengeluaran'],
                datasets: [
                    {
                        data: [composition.totalPemasukan, composition.totalPengeluaran],
                        backgroundColor: ['#10B981', '#EF4444'],
                        borderWidth: 0,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${formatRupiah(ctx.parsed)}`,
                        },
                    },
                },
            },
        })

        return () => {
            trendChart.destroy()
            compositionChart.destroy()
        }
    }, [trendData, composition])

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800">
            <SidebarKaryawan
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                active="report"
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
                                Laporan Keuangan
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Ringkasan arus keuangan toko
                            </p>
                        </div>

                        {/* Period Tabs */}
                        <div className="inline-flex bg-slate-100 rounded-xl p-1.5">
                            {PERIOD_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setPeriode(tab.key)}
                                    className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-bold transition-colors ${periode === tab.key
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                            <div className="mb-4">
                                <h2 className="font-bold text-slate-800">Tren Arus Keuangan</h2>
                                <p className="text-xs text-slate-400 font-medium">{PERIOD_SUBTITLE[periode]}</p>
                            </div>
                            <div className="h-72 sm:h-80">
                                <canvas ref={trendChartRef}></canvas>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                            <div className="mb-2">
                                <h2 className="font-bold text-slate-800">Komposisi</h2>
                                <p className="text-xs text-slate-400 font-medium">{PERIOD_SUBTITLE[periode]}</p>
                            </div>
                            <div className="h-56 flex items-center justify-center">
                                <canvas ref={compositionChartRef}></canvas>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-slate-500 font-medium">Pemasukan</span>
                                    <span className="ml-auto font-bold text-emerald-600">
                                        {formatRupiah(composition.totalPemasukan)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span className="text-slate-500 font-medium">Pengeluaran</span>
                                    <span className="ml-auto font-bold text-red-500">
                                        {formatRupiah(composition.totalPengeluaran)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ReportKeuangan