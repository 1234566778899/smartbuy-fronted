import React from 'react'
import { useForm } from 'react-hook-form'
import { closeModal, showToastInfo } from '../utils';
import axios from 'axios';

export const EditCustomerApp = ({ customer, setUser, getCustomers }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            dni: customer.dni || '',
            name: customer.name || '',
            lname: customer.lname || '',
            monthly_income: customer.monthly_income || ''
        }
    });

    const submitUpdateCustomer = (data) => {
        axios.put(`http://localhost:4000/user/edit/${customer._id}`, data)
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
                        <div className='form-group'>
                            <label className='form-label'>DNI</label>
                            <input {...register('dni', { required: true })} type="text" className='form-control' placeholder='4556756..' />
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
                            <label className='form-label'>Ingreso mensual</label>
                            <input {...register('monthly_income', { required: true })} type="number" step={0.00001} className='form-control' placeholder='S/ 00.00' />
                        </div>
                        <button className='btn btn-success mt-2 w-100' type='submit'>Guardar</button>
                    </form>
                </div>
            </div>
        </>
    )
}
