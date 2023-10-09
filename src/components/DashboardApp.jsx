import React from 'react'
import { NavApp } from './NavApp'

export const DashboardApp = () => {
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <h1>Dashboard</h1>
            </div>
        </>
    )   
}
