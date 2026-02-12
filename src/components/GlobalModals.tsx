"use client";

import React from 'react';
import { useModal } from '@/context/ModalContext';
import LoginModal from '@/components/LoginModal/LoginModal';
import SignUpModal from '@/components/SignUpModal/SignUpModal';

const GlobalModals = () => {
    const { isLoginOpen, isSignUpOpen, closeLogin, closeSignUp, openSignUp, openLogin, signUpInitialData } = useModal();

    return (
        <>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={closeLogin}
                onSignUpClick={openSignUp}
            />
            <SignUpModal
                isOpen={isSignUpOpen}
                onClose={closeSignUp}
                onLoginClick={openLogin}
                initialData={signUpInitialData}
            />
        </>
    );
};

export default GlobalModals;
