"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './dashboard-layout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Mobile Header */}
                <div className={styles.mobileHeader}>
                    <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Menu size={24} />
                    </button>
                    <Image src="/logo 1.png" alt="Sindoor" width={100} height={35} style={{ objectFit: 'contain' }} />
                    <div style={{ width: 24 }}></div> {/* Spacer */}
                </div>

                {children}
            </main>
        </div>
    );
}
