import React from 'react';
import Sidebar from '../../../components/layouts/Sidebar';
export default function AdminInventory() {
    return (
        <>
        <div className='flex flex-row '>
            <Sidebar />
            <div className='p-4'>
                <h1>Inventory Page</h1>
            </div>
        </div>  
        </>
    );
}