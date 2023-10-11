import React from 'react'
import { useNavigate } from 'react-router-dom'

export const NavApp = ({ logged = false }) => {
    const navigate = useNavigate();
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-2" data-bs-theme="dark">
                <div className="container">
                    <a className="navbar-brand" href="#">SMARTBUY</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor02">
                        <ul className="navbar-nav ml-auto">
                            {
                                !logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" onClick={() => navigate('/login')}>LOGIN</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" onClick={() => navigate('/register')}>SIGN UP</a>
                                        </li>
                                    </>
                                )
                            }
                            {
                                logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" onClick={() => navigate('/customer')}>Clientes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" onClick={() => navigate('/quotation')}>Cotizaciones</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#" onClick={() => navigate('/dashboard')}>Dashboard</a>
                                        </li>
                                        <li>
                                            <div className="avatar">
                                                <span>C</span>
                                            </div>
                                        </li>
                                    </>
                                )
                            }

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
