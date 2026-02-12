"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isLoginOpen: boolean;
    isSignUpOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    openSignUp: (initialData?: any) => void;
    closeSignUp: () => void;
    signUpInitialData: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [signUpInitialData, setSignUpInitialData] = useState<any>(null);

    const openLogin = () => {
        setIsSignUpOpen(false);
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openSignUp = (initialData: any = null) => {
        setSignUpInitialData(initialData);
        setIsLoginOpen(false);
        setIsSignUpOpen(true);
    };

    const closeSignUp = () => {
        setIsSignUpOpen(false);
        setSignUpInitialData(null);
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
