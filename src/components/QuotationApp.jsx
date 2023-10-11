import React from 'react'
import { NavApp } from './NavApp'
import { useNavigate } from 'react-router-dom'

export const QuotationApp = () => {
    const navigate = useNavigate();
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h3>Historial de cotizaciones</h3>
                <hr />
                <div className="text-right">
                    <button className='btn btn-info mb-2' onClick={()=>navigate('/add/quotation')}>AGREGAR COTIZACIÓN</button>
                </div>
                <div className='d-flex'>
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Inicio' />
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Fin' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='DNI' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Nombre' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Apellido' />
                    <button className='btn btn-success'>Buscar</button>
                </div>
                <table className='table bg-white table-quotation'>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Fecha</th>
                            <th>DNI</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>VAN</th>
                            <th>TIR</th>
                            <th>CRÉDITO</th>
                            <th>INTERÉS</th>
                            <th>PERIODOS DE GRACIA</th>
                            <th>MESES DE PLAZO</th>
                            <th>VEHÍCULO</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </>
    )
}
