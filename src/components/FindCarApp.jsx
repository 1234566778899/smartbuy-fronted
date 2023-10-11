import React from 'react'
import { closeModal } from '../utils'

export const FindCarApp = () => {
    return (
        <div id='find_car'>
            <div className="box">
                <h4 className='text-center'>Seleccione un auto</h4>
                <hr />
                <div className='form-grouo'>
                    <h6 className='form-label'>Buscar auto</h6>
                    <input type="text" className='form-control' placeholder='Nombre del auto..' />
                </div>
                <p>Seleccione el auto a financiar</p>
                <div className="group-autos">
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                    <div className="car-box">
                        <img src="https://img.freepik.com/fotos-premium/coche-deportivo-aislado-ilustracion-renderizado-3d-fondo_494250-4838.jpg?size=338&ext=jpg&ga=GA1.1.386372595.1696464000&semt=ais" alt="img-auto" />
                        <span><strong>Audi</strong></span><br />
                        <span>Luxury sedan with leather interior</span>
                        <h6>S/. 50,245.00</h6>
                    </div>
                </div>
                <div className="text-right">
                    <button className='btn btn-danger mt-2' onClick={() => closeModal('#find_car')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
