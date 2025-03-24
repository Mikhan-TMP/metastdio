// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import API from '../../../utils/api';

// const ForgotPass = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await API.post('/forgot-password', { email });
//             setMessage('Password reset link has been sent to your email');
//             // Optionally redirect after a few seconds
//             setTimeout(() => router.push('/'), 3000);
//         } catch (error: any) {
//             setMessage(error.response?.data?.message || 'Something went wrong');
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent dark:bg-transparent">
//             <h1 className="text-2xl font-bold mb-4">HEHEH WALA PA</h1>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
//                     required
//                 />
//                 <button 
//                     type="submit" 
//                     className="bg-foreground text-background py-2 rounded hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
//                 >
//                     Send Code
//                 </button>
//             </form>
//             {message && (
//                 <p className={`mt-4 ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
//                     {message}
//                 </p>
//             )}
//             <button 
//                 onClick={() => router.push('/')} 
//                 className="mt-4 text-blue-500 hover:underline"
//             >
//                 Back to Login
//             </button>
//         </div>
//     );
// };

// export default ForgotPass;