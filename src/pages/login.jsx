import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrorMsg('')

        if (password !== '123') {
            setErrorMsg('Password salah')
            return
        }

        if (username === 'karyawan') {
            navigate('/karyawan/home')
        } else if (username === 'owner') {
            navigate('/owner/home')
        } else {
            setErrorMsg('Username tidak dikenali')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2563EB] overflow-hidden relative">
            <div className="login-card relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Selamat Datang
                </h2>
                <p className="text-sm text-gray-500 text-center mb-8">
                    Masuk ke akun Anda
                </p>

                {/* Error message */}
                {errorMsg && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                        {errorMsg}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan Password"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
                                aria-label="Toggle password visibility"
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2">Ingat saya</span>
                        </label>

                        <a href="#"
                            className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline"
                        >
                            Lupa kata sandi?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#2563EB] text-white font-bold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-sign-in-alt"></i> Masuk
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login