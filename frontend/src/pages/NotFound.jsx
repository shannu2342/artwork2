import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-10 text-center">
            <h1 className="text-4xl font-black text-[#2C3E50] mb-3">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
                The page you requested does not exist or was moved.
            </p>
            <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F9D423] to-[#D4AF37] text-[#1a252f] font-bold px-6 py-3"
            >
                Go Back Home
            </Link>
        </div>
    </div>
);

export default NotFound;
