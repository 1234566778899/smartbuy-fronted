import React from 'react'
import { useForm } from 'react-hook-form'
import { closeModal, onlyEnteros, showToastInfo, soloLetras } from '../utils';
import axios from 'axios';
import { CONFI } from '../utils/config';

export const EditCustomerApp = ({ customer, setUser, getCustomers }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            documentType: customer.documentType || '',
            documentNumber: customer.documentNumber || '',
            name: customer.name || '',
            lname: customer.lname || '',
            monthlyIncome: customer.monthlyIncome || '',
            address: customer.address || '',
            email: customer.email || '',
            telephone: customer.telephone || '',
        }
    });

    const submitUpdateCustomer = (data) => {
        axios.put(`${CONFI.uri}/user/edit/${customer._id}`, data)
            .then(x => {
                showToastInfo('Cliente modificado correctamente');
                setUser(false);
                getCustomers();
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error');
            })
    }
    return (
        <>
            <div id='edit_customer'>
                <div className='box'>
                    <div className='text-right'>
                        <span className='icono-close' onClick={() => setUser(false)}>X</span>
                    </div>
                    <h5 className='text-center'>Editar cliente</h5>
                    <hr />
                    <form onSubmit={handleSubmit(submitUpdateCustomer)}>
                        <div className="d-flex">
                            <div className='w-100 mr-1'>
                                <label className='form-label'>Tipo de documento</label>
                                <select className='form-control' {...register('documentType')}>
                                    <option value="DNI">DNI</option>
                                    <option value="CE">Carné de Extranjería</option>
                                    <option value="P">Pasaporte</option>
                                </select>
                            </div>
                            <div className='w-100 ml-1'>
                                <label className='form-label'>Número de documento</label>
                                <input onInput={(e) => onlyEnteros(e.target)} {...register('documentNumber', { required: true, maxLength: 8, minLength: 8 })} type="text" className='form-control' placeholder='4556756..' />
                            </div>
                        </div>
                        {errors.documentNumber?.type == 'required' && <span className='text-danger'>El dni es obligatorio</span>}
                        {(errors.documentNumber?.type == 'maxLength' || errors.documentNumber?.type == 'minLength') && <span className='text-danger'>El dni debe tener 8 dígitos</span>}
                        <div className='form-group'>
                            <label className='form-label'>Nombre</label>
                            <input onInput={(e) => soloLetras(e)} {...register('name', { required: true })} type="text" className='form-control' placeholder='Escribe un nombre..' />
                        </div>
                        {errors.name && <span className='text-danger'>El nombre es obligatorio</span>}
                        <div className='form-group'>
                            <label className='form-label' >Apellido</label>
                            <input onInput={(e) => soloLetras(e)}{...register('lname', { required: true })} type="text" className='form-control' placeholder='Escribe un apellido..' />
                        </div>
                        {errors.lname && <span className='text-danger'>El apellido es obligatorio</span>}
                        <div className='form-group'>
                            <label className='form-label'>Dirección</label>
                            <input {...register('address', { required: true })} type="text" className='form-control' placeholder='Av. ..' />
                        </div>
                        {errors.lname && <span className='text-danger'>El dni es obligatorio</span>}
                        <div className="d-flex">
                            <div className='w-100 mr-1'>
                                <label className='form-label'>Teléfono</label>
                                <input {...register('telephone', { required: true, })} type="text" className='form-control' placeholder='93..' onInput={(e) => onlyEnteros(e.target)} />
                            </div>
                            <div className='w-100 ml-1'>
                                <label className='form-label' >Email</label>
                                <input {...register('email', { required: true, email: true })} type="email" className='form-control' placeholder='...@gmail.com' />
                            </div>
                        </div>
                        {errors.telephone && <span className='text-danger d-block'>El telefono es obligatorio</span>}
                        {errors.email && <span className='text-danger'>El email es obligatorio</span>}
                        <button className='btn btn-success mt-2 w-100' type='submit'>Guardar</button>
                    </form>
                </div>
            </div>
        </>
    )
}
