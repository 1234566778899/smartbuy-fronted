import React from 'react'
import { NavApp } from './NavApp'

export const DashboardApp = () => {
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h1>Dashboard</h1>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <card className="card card-header text-center fs-1">
                                <h6>Cantidad de clientes</h6>
                            </card>
                            <card className="card-body text-center fs-1">
                                15
                            </card>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <card className="card card-header text-center fs-1">
                                <h6>Cantidad de Cotizaciones</h6>
                            </card>
                            <card className="card-body text-center fs-1">
                                25
                            </card>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </>
    )
}
