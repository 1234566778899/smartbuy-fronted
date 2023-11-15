import React, { useEffect, useRef } from 'react'
import { closeModal, onlyEnteros, showToastInfo, soloNumerosDecimales } from '../utils'
import { CARS } from '../utils/Cars'
import { useState } from 'react'

export const FindCarApp = ({ selectCar, currency, setDialog }) => {
    console.log(currency);
    const [carFiltered, setCarFiltered] = useState([]);
    const [carSelected, setCarSelected] = useState({});
    const price = useRef();

    useEffect(() => {
        setCarFiltered(CARS.map(x => currency == 'PEN' ? ({ ...x, price: x.price * 3.80 }) : ({ ...x })))
    }, [currency])

    const filterCar = (param) => {
        param = param.toLowerCase();
        setCarFiltered(CARS.filter(car => car.name.toLowerCase().includes(param) || car.description.toLowerCase().includes(param)));
    }

    return (
        <div id='find_car'>
            <div className="box" id='box_find_car'>
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
                                <span><strong>{car.brand} {car.model}</strong></span><br />
                                <span>{car.yearManufactured} {car.color}</span>
                                <h6>{currency == 'USD' ? '$' : 'S/.'} {car.price}</h6>
                            </div>
                        ))
                    }
                </div>

                <br />
                <div className='d-flex justify-content-between'>
                    <button className='btn btn-danger' onClick={() => setDialog(false)}>Cancelar</button>
                    <div className="d-flex align-items-center w-50">
                        <span className='icon-currency'>$</span>
                        <input
                            onInput={(e) => soloNumerosDecimales(e)}
                            ref={price}
                            type="text"
                            className='form-control bg-white inp-price mt-2'
                            value={carSelected.price || ''}
                            placeholder='Precio'
                            onChange={(e) => setCarSelected(car => ({ ...car, price: e.target.value }))}
                        />
                        <button className='btn btn-primary ml-2 mt-1' onClick={() => {
                            if (price.current.value.trim() == '') return showToastInfo('Debe seleccionar un vehículo');
                            if (Number(price.current.value) <= 0) return showToastInfo('Debe ingresar un valor mayor a cero');
                            selectCar(carSelected);
                            setDialog(false);
                        }}>Aceptar</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
