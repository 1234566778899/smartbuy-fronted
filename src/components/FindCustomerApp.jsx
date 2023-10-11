import React from 'react'
import { closeModal } from '../utils'

export const FindCustomerApp = () => {
    return (
        <div id='find_customer'>
            <div className="box">
                <h4 className='text-center'>Seleccione un cliente</h4>
                <br />
                <div className='form-grouo'>
                    <h6 className='form-label'>Buscar cliente</h6>
                    <input type="text" className='form-control' placeholder='Nombre del cliente..' />
                </div>
                <div className='table-find-customer mt-2'>
                    <table className='table text-center bg-white'>
                        <thead>
                            <tr>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                            <tr>
                                <td>61126863</td>
                                <td>Carlos Jesús</td>
                                <td>Ordaz Hoyos</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='text-right mt-2'>
                    <button className='btn btn-danger' onClick={() => closeModal('#find_customer')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
