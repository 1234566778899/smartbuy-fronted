import React from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { openModal } from '../utils'
import { FindCarApp } from './FindCarApp'

export const AddQuotationApp = () => {
    return (
        <>
            <FindCustomerApp />
            <FindCarApp />
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h3>GENERAR COTIZACIÓN</h3>
                <hr />
                <br />

                <div className="row">
                    <div className="col-md-6">
                        <h6 className='form-label'>Cliente</h6>
                        <div className="input-group">
                            <input type="text" className='form-control' readOnly />
                            <button className='btn btn-info' onClick={() => openModal('#find_customer')}>Seleccionar cliente</button>
                        </div>
                        <div className="form-group mt-2">
                            <h6 className='form-label'>Moneda</h6>
                            <select className='form-control bg-white'>
                                <option value="PEN">Soles</option>
                                <option value="PEN">Dolares</option>
                            </select>
                        </div>
                        <h6 className='form-label mt-2'>Valor del vehículo</h6>
                        <div className="input-group">
                            <input type="text" className='form-control' readOnly />
                            <button className='btn btn-info' onClick={() => openModal('#find_car')}>Seleccionar vehículo</button>
                        </div>
                        <div className="form-group mt-2">
                            <h6 className='form-label'>Cuota Inicial</h6>
                            <select className='form-control bg-white'>
                                <option value="PEN">20%</option>
                                <option value="PEN">30%</option>
                            </select>
                        </div>
                        <div className='alert alert-success'>
                            Monto a financiar: S/. 15,000.00
                        </div>
                        <div className="form-group mt-2">
                            <h6 className='form-label'>Tipo de tasa</h6>
                            <select className='form-control bg-white'>
                                <option value="PEN">Nominal</option>
                                <option value="PEN">Efectiva</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <h6 className='form-label'>Valor de la tasa (%)</h6>
                            <input type="text" className='form-control bg-white' placeholder='25.5%' />
                        </div>
                        <div className="form-group">
                            <h6 className='form-label'>Seguro de desgravamen (%)</h6>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' />
                        </div>
                        <div className="form-group mt-2">
                            <h6 className='form-label'>Número de cuotas</h6>
                            <select className='form-control bg-white'>
                                <option value="PEN">24</option>
                                <option value="PEN">36</option>
                            </select>
                        </div>
                        <button className='btn btn-success mt-3'>GENERAR CRONOGRAMA DE PAGOS</button>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </>
    )
}
