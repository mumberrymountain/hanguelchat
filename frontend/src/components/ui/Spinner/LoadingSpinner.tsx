import React from 'react'
import { BeatLoader } from 'react-spinners';
import { useTranslations } from 'next-intl';

const LoadingSpinner = () => {
    const locale = useTranslations('LoadingSpinner');

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <BeatLoader color="#8349fe" loading={true} size={15} aria-label="Loading Spinner"/>
            <p className={`text-gray-300 text-sm font-medium`}>{locale('loading')}</p>
        </div>
    )
}

export default LoadingSpinner