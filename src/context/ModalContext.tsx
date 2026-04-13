"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isLoginOpen: boolean;
    isSignUpOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    openSignUp: (initialData?: unknown) => void;
    closeSignUp: () => void;
    signUpInitialData: SignUpInitialData;
}

type SignUpInitialData = {
    email?: string;
    password?: string;
    profileFor?: string;
} | undefined;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [signUpInitialData, setSignUpInitialData] = useState<SignUpInitialData>(undefined);

    const openLogin = () => {
        setIsSignUpOpen(false);
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openSignUp = (initialData?: unknown) => {
        const nextInitialData =
            initialData &&
            typeof initialData === 'object' &&
            ('email' in initialData || 'password' in initialData || 'profileFor' in initialData)
                ? (initialData as SignUpInitialData)
                : undefined;

        setSignUpInitialData(nextInitialData);
        setIsLoginOpen(false);
        setIsSignUpOpen(true);
    };

    const closeSignUp = () => {
        setIsSignUpOpen(false);
        setSignUpInitialData(undefined);
    };

    return (
        <ModalContext.Provider value={{
            isLoginOpen,
            isSignUpOpen,
            openLogin,
            closeLogin,
            openSignUp,
            closeSignUp,
            signUpInitialData
        }}>
            {children}
        </ModalContext.Provider>

    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
