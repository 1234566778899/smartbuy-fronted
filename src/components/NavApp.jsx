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

    const openNav = () => {
        const doc1 = document.querySelector('#nav_collapse');
        doc1.classList.toggle('hide');
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
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-2" data-bs-theme="dark">
                <div className="container">
                    <a className="navbar-brand" href="#" onClick={() => { navigate('/login') }}> SMARTBUY</a>
                    <button className="navbar-toggler" type="button" onClick={() => openNav()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="nav_collapse" className='hide w-100'>
                        <ul className="navbar-nav justify-content-end">
                            {
                                !logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'login' ? 'active' : ''}`} onClick={() => { navigate('/login'); localStorage.setItem('nav', 'login') }}>LOGIN</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'register' ? 'active' : ''}`} onClick={() => { navigate('/register'); localStorage.setItem('nav', 'register') }}>SIGN UP</a>
                                        </li>
                                    </>
                                )
                            }
                            {
                                logged && (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'client' ? 'active' : ''}`} onClick={() => { navigate('/customer'); localStorage.setItem('nav', 'client') }}>Clientes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'quotation' ? 'active' : ''}`} onClick={() => { navigate('/quotation'); localStorage.setItem('nav', 'quotation') }}>Historial</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'add' ? 'active' : ''}`} onClick={() => { navigate('/add/quotation'); localStorage.setItem('nav', 'add') }}>Agregar cotizacion</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${localStorage.getItem('nav') == 'dashboard' ? 'active' : ''}`} onClick={() => { navigate('/dashboard'); localStorage.setItem('nav', 'dashboard') }}>Dashboard</a>
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
