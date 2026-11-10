'use client';

import BackButton from '@/components/BackButton';
import PretextDemo from '@/components/PretextDemo';

export default function PretextPage() {
    return (
        <>
            <div className="fixed top-6 left-6 z-50">
                <BackButton />
            </div>
            <PretextDemo />
        </>
    );
}
