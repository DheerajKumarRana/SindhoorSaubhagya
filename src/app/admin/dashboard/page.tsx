'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, UserPlus, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingProfiles: 0,
        pendingPhotos: 0,
        approvedProfiles: 0
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            try {
                // Parallel requests for speed
                const [
                    { count: totalUsers },
                    { count: pendingProfiles },
                    { count: approvedProfiles },
                    // { count: pendingPhotos } // Photos table might be different, let's check schema
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
                    // supabase.from('profile_photos').select('*', { count: 'exact', head: true }).eq('is_approved', false) 
                ]);

                setStats({
                    totalUsers: totalUsers || 0,
                    pendingProfiles: pendingProfiles || 0,
                    approvedProfiles: approvedProfiles || 0,
                    pendingPhotos: 0 // Placeholder until photos implemented
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard stats...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Pending Approvals Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold">Pending Profiles</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingProfiles}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full">
                            <UserPlus className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <Link
                        href="/admin/users?status=pending"
                        className="text-sm text-orange-600 font-medium mt-4 inline-block hover:underline"
                    >
                        Review Applications &rarr;
                    </Link>
                </div>

                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold">Total Users</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <Link
                        href="/admin/users"
                        className="text-sm text-blue-600 font-medium mt-4 inline-block hover:underline"
                    >
                        View All Users &rarr;
                    </Link>
                </div>

                {/* Examples of other cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold">Approved Profiles</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.approvedProfiles}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold">Pending Photos</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingPhotos}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <ImageIcon className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <span className="text-sm text-gray-400 mt-4 inline-block italic">Coming Soon</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <Link href="/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Manage Users
                    </Link>
                    {/* Add more actions */}
                </div>
            </div>
        </div>
    );
}
