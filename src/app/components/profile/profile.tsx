import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileManagement = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: localStorage.getItem('userName') || 'N/A',
        email: localStorage.getItem('userEmail') || 'N/A',
        avatar: '/default-avatar.png',
        bio: 'Software Developer',
        location: 'New York, USA',
        phone: '+1 234 567 8900'
    });

    const handleLogout = () => {
        try {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('token');
            
            toast.success('Logged out successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Delay navigation to show the toast
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error) {
            toast.error('Failed to logout. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="bg-white rounded-lg shadow-md p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                        <Image
                            src={profileData.avatar}
                            alt="Profile Picture"
                            width={120}
                            height={120}
                            className="rounded-full"
                        />
                        <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                        <p className="text-gray-600">{profileData.bio}</p>
                    </div>
                </div>

                {/* Profile Information Form */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                disabled={!isEditing}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                disabled={!isEditing}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                disabled={!isEditing}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={profileData.location}
                                disabled={!isEditing}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                            value={profileData.bio}
                            disabled={!isEditing}
                            className="w-full p-3 border rounded-lg h-32 resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                        {isEditing && (
                            <button
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;