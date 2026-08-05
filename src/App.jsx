import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import OwnerHome from './pages/Owner/Home'
import KaryawanHome from './pages/Karyawan/Home'
import Kasir from './pages/Karyawan/POS/Kasir'
import HistoryPenjualan from './pages/Karyawan/POS/HistoryPenjualan'
import EditHistoryPenjualan from './pages/Karyawan/POS/EditHistoryPenjualan'
import IndexKategori from './pages/Karyawan/Inventory/Kategori/IndexKategori'
import AddKategori from './pages/Karyawan/Inventory/Kategori/AddKategori'
import EditKategori from './pages/Karyawan/Inventory/Kategori/EditKategori'
import IndexProduk from './pages/Karyawan/Inventory/Produk/IndexProduk'
import AddProduk from './pages/Karyawan/Inventory/Produk/AddProduk'
import JournalKeuangan from './pages/Karyawan/Accounting/JournalKeuangan'
import ReportKeuangan from './pages/Karyawan/Accounting/ReportKeuangan'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/owner/home" element={<OwnerHome />} />
        <Route path="/karyawan/home" element={<KaryawanHome />} />
        <Route path="/karyawan/kasir" element={<Kasir />} />
        <Route path="/karyawan/history_penjualan" element={<HistoryPenjualan />} />
        <Route path="/karyawan/history_penjualan/edit" element={<EditHistoryPenjualan />} />

        <Route path="/karyawan/kategori" element={<IndexKategori />} />
        <Route path="/karyawan/kategori/add" element={<AddKategori />} />
        <Route path="/karyawan/kategori/edit" element={<EditKategori />} />

        <Route path="/karyawan/produk" element={<IndexProduk />} />
        <Route path="/karyawan/produk/add" element={<AddProduk />} />

        <Route path="/karyawan/journal_keuangan" element={<JournalKeuangan />} />
        <Route path="/karyawan/report_keuangan" element={<ReportKeuangan />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App