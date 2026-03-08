import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Dummy authentication
        if (password === 'admin123') {
            localStorage.setItem('adminAuth', 'true');
            navigate('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2C3E50] mb-2">Admin Access</h2>
                <p className="text-gray-500 mb-8">Enter the secure password to continue.</p>

                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 py-2 rounded-lg">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-center text-lg tracking-widest"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#2C3E50] hover:bg-[#D4AF37] text-white font-bold py-4 px-8 rounded-lg transition-colors">
                        Login to Dashboard
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-400">Hint: admin123</p>
            </div>
        </div>
    );
};

export default Login;
