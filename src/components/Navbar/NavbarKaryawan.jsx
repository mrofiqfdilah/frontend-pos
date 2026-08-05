import { useState, useRef, useEffect } from 'react'

function NavbarKaryawan({ title, subtitle, onOpenSidebar }) {
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

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
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 h-20 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
            <button
                onClick={onOpenSidebar}
                className="lg:hidden text-slate-500 hover:text-slate-700"
            >
                <i className="ri-menu-line text-2xl"></i>
            </button>

            {(title || subtitle) && (
                <div>
                    {title && (
                        <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="text-xs text-slate-400 font-medium hidden sm:block">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

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
                                <p className="text-xs text-slate-400">Kasir</p>
                            </div>
                        </div>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <i className="ri-user-3-line text-slate-400"></i> Profil
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <i className="ri-settings-3-line text-slate-400"></i> Pengaturan
                        </a>
                        <div className="border-t border-slate-100"></div>
                        <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50">
                            <i className="ri-logout-box-r-line"></i> Logout
                        </a>
                    </div>
                </div>
            </div >
        </header >
    )
}

export default NavbarKaryawan