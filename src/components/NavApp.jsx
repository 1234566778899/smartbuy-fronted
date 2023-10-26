import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo-smartbuy.svg'
import { closeModal, openAcordeon, openModal2, showToastInfo } from '../utils';
import axios from 'axios';
import { CONFI } from '../utils/config';
export const NavApp = ({ logged = false }) => {
    const [user, setuser] = useState(null);
    const navigate = useNavigate();
    const handleClick = (event) => {
        close('#box_out', '#box_avatar', event);
    };
    const close = (cont, value, event) => {
        const box = document.querySelector(cont);
        const avatar = document.querySelector(value);
        if (box && avatar && !box.contains(event.target) && !avatar.contains(event.target)) {
            closeModal(cont);
        }
    }
    const getUser = () => {
        const userId = localStorage.getItem('id');
        axios.get(`${CONFI.uri}/user/find/${userId}`)
            .then(response => {
                if (response.data) setuser(response.data);
            })
            .catch(error => {
                console.log(error);
                if (logged) {
                    showToastInfo('No tienes acceso');
                    navigate('/login');
                }
            })
    }
    useEffect(() => {
        getUser();

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-darki navbar-dark py-2" data-bs-theme="dark">
                <div className="container">
                    <a className="navbar-brand" href="#" onClick={() => { navigate('/login') }}><img src={logo} alt="logo" width={30} style={{ color: 'white' }} /> SMARTBUY</a>
                    <button className="navbar-toggler" onClick={() => openAcordeon('#nav_collapse')} type="button" >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="nav_collapse">
                        <ul className="navbar-nav ml-auto">
                            {
                                !logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'login' ? 'active' : ''}`} href="#" onClick={() => { navigate('/login'); localStorage.setItem('nav', 'login') }}>LOGIN</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'register' ? 'active' : ''}`} href="#" onClick={() => { navigate('/register'); localStorage.setItem('nav', 'register') }}>SIGN UP</a>
                                        </li>
                                    </>
                                )
                            }
                            {
                                logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'client' ? 'active' : ''}`} href="#" onClick={() => { navigate('/customer'); localStorage.setItem('nav', 'client') }}>Clientes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'quotation' ? 'active' : ''}`} href="#" onClick={() => { navigate('/quotation'); localStorage.setItem('nav', 'quotation') }}>Cotizaciones</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'dashboard' ? 'active' : ''}`} href="#" onClick={() => { navigate('/dashboard'); localStorage.setItem('nav', 'dashboard') }}>Dashboard</a>
                                        </li>
                                        <li>
                                            <div className="avatar" id='box_avatar' onClick={() => openModal2('#box_out')}>
                                                <span>{user && user.username[0]}</span>
                                            </div>
                                            <div className="box-out" id='box_out'>
                                                <div className="item">
                                                    <span>{user && user.username}</span>
                                                </div>
                                                <div className='item' onClick={() => { navigate('/login'); localStorage.setItem('id', ''); localStorage.setItem('nav', 'login') }}>
                                                    <i className="fa-solid fa-right-from-bracket"></i>
                                                    <span className='ml-2'>Salir</span>
                                                </div>
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
