import React from 'react'
import { closeModal } from '../utils'
import { CARS } from '../utils/Cars'
import { useState } from 'react'

export const FindCarApp = ({ selectCar }) => {
    const [carFiltered, setCarFiltered] = useState(CARS)
    const [inpPrice, setInpPrice] = useState();
    const [carSelected, setCarSelected] = useState();
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
                <div className="group-autos p-2">
                    {
                        carFiltered.map(car => (
                            <div key={car.id} className={carSelected ? (`${car.price == carSelected.price ? 'car-selected car-box' : 'car-box'}`) : 'car-box'} onClick={() => { setCarSelected(car) }} >
                                <img src={car.img} alt="img-auto" />
                                <span><strong>{car.name}</strong></span><br />
                                <span>{car.description}</span>
                                <h6>{car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</h6>
                            </div>
                        ))
                    }
                </div>

                <br />
                <div className='d-flex justify-content-between'>
                    <button className='btn btn-danger' onClick={() => closeModal('#find_car')}>Cancelar</button>
                    <div className="d-flex align-items-center w-50">
                        <span className='icon-currency'>$</span>
                        <input type="text" className='form-control bg-white inp-price mt-2' value={carSelected && carSelected.price} placeholder='Precio' onChange={(e) => setCarSelected(car => ({ ...car, price: e.target.value }))} />
                        <button className='btn btn-primary ml-2 mt-1' onClick={() => { selectCar(carSelected); closeModal('#find_car') }}>Aceptar</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
