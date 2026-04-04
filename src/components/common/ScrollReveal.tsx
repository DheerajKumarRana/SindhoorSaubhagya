"use client";

import React from 'react';
import styles from './ScrollReveal.module.css';

type ScrollRevealProps = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
};

export default function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
    const [visible, setVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setVisible(true);
                observer.unobserve(entry.target);
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
