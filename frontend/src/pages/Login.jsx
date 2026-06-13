import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { clearAdminFlashMessage, getAdminFlashMessage, getAdminToken, loginAdmin } from '../services/adminAuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [usernameReady, setUsernameReady] = useState(false);
    const [passwordReady, setPasswordReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (getAdminToken()) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const flashMessage = getAdminFlashMessage();
        if (!flashMessage) {
            return;
        }

        setError(flashMessage);
        clearAdminFlashMessage();
    }, []);

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

                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                    <input
                        type="text"
                        name="fake-username"
                        autoComplete="username"
                        className="hidden"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                    <input
                        type="password"
                        name="fake-password"
                        autoComplete="new-password"
                        className="hidden"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                    <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            name="admin-login-identifier"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            onFocus={() => setUsernameReady(true)}
                            onMouseDown={() => setUsernameReady(true)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                            placeholder="Admin username"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            readOnly={!usernameReady}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="admin-login-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onFocus={() => setPasswordReady(true)}
                            onMouseDown={() => setPasswordReady(true)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                            placeholder="Password"
                            autoComplete="new-password"
                            readOnly={!passwordReady}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2C3E50] transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
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
