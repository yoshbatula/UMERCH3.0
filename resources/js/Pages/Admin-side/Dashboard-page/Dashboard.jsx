import React from 'react';
import Sidebar from '../../../components/layouts/Sidebar';

export default function Dashboard() {
    return (
        <>
        <div className='flex flex-row '>
            <Sidebar />
            <div className='p-4'>
                <h1>yosh</h1>
            </div>
        </div>  
        </>
    );
}