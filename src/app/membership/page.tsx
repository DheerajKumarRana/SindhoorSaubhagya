"use client";

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Pricing from '@/components/Pricing/Pricing';
import Footer from '@/components/Footer/Footer';

const MembershipPage = () => {
    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <Pricing />
            </div>
            <Footer />
        </main>
    );
};

export default MembershipPage;
