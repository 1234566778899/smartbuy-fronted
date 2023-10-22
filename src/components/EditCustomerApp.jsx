import React from 'react'
import { useForm } from 'react-hook-form'
import { closeModal, showToastInfo } from '../utils';
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
                        <div className="input-group">
                            <div className='form-group'>
                                <label className='form-label'>Tipo de documento</label>
                                <select className='form-control' {...register('documentType')}>
                                    <option value="DNI">DNI</option>
                                    <option value="CE">Carné de Extranjería:</option>
                                    <option value="P">Pasaporte</option>
                                </select>
                            </div>
                            <div className='form-group ml-2'>
                                <label className='form-label'>Número de documento</label>
                                <input {...register('documentNumber', { required: true })} type="text" className='form-control' placeholder='4556756..' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Nombre</label>
                            <input {...register('name', { required: true })} type="text" className='form-control' placeholder='Escribe un nombre..' />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Apellido</label>
                            <input {...register('lname', { required: true })} type="text" className='form-control' placeholder='Escribe un apellido..' />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Dirección</label>
                            <input {...register('address', { required: true })} type="text" className='form-control' placeholder='Av. ..' />
                        </div>
                        <div className="input-group">
                            <div className='form-group'>
                                <label className='form-label'>Teléfono</label>
                                <input {...register('telephone', { required: true, })} type="text" className='form-control' placeholder='93..' />
                            </div>
                            <div className='form-group ml-2'>
                                <label className='form-label'>Email</label>
                                <input {...register('email', { required: true, })} type="email" className='form-control' placeholder='...@gmail.com' />
                            </div>
                        </div>
                        <button className='btn btn-success mt-2 w-100' type='submit'>Guardar</button>
                    </form>
                </div>
            </div>
        </>
    )
}
