import React from 'react'
import { closeModal } from '../utils'
import { CARS } from '../utils/Cars'
import { useState } from 'react'

export const FindCarApp = ({ selectCar }) => {
    const [carFiltered, setCarFiltered] = useState(CARS)

    const filterCar = (param) => {
        param = param.toLowerCase();
        setCarFiltered(CARS.filter(car => car.name.toLowerCase().includes(param) || car.description.toLowerCase().includes(param)));
    }
    return (
        <div id='find_car'>
            <div className="box">
                <h4 className='text-center'>Seleccione un auto</h4>
                <hr />
                <div className='form-group'>
                    <label className='form-label'>Buscar auto</label>
                    <input type="text" className='form-control bg-white' placeholder='Nombre del auto..' onChange={(e) => filterCar(e.target.value)} />
                </div>
                <br />
                <label>Seleccione el auto a financiar</label>
                <div className="group-autos">
                    {
                        carFiltered.map(car => (
                            <div key={car.id} className="car-box" onClick={() => { selectCar(car); closeModal('#find_car'); }}>
                                <img src={car.img} alt="img-auto" />
                                <span><strong>{car.name}</strong></span><br />
                                <span>{car.description}</span>
                                <h6>{car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</h6>
                            </div>
                        ))
                    }
                </div>
                <div className="text-right">
                    <button className='btn btn-danger mt-2' onClick={() => closeModal('#find_car')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
