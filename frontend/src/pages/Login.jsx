import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User } from 'lucide-react';
import { getAdminToken, loginAdmin } from '../services/adminAuthService';

const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (getAdminToken()) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginAdmin({
                username: username.trim(),
                password
            });
            navigate('/admin', { replace: true });
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2C3E50] mb-2">Admin Access</h2>
                <p className="text-gray-500 mb-8">Login with your admin username and password.</p>

                {error ? <p className="text-red-500 text-sm mb-4 bg-red-50 py-2 rounded-lg">{error}</p> : null}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                            placeholder="Admin username"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2C3E50] hover:bg-[#D4AF37] text-white font-bold py-4 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
