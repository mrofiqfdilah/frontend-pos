import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import OwnerHome from './pages/owner/Home'
import KaryawanHome from './pages/Karyawan/Home'
import Kasir from './pages/Karyawan/POS/Kasir'
import HistoryPenjualan from './pages/Karyawan/POS/HistoryPenjualan'
import EditHistoryPenjualan from './pages/Karyawan/POS/EditHistoryPenjualan'

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
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App