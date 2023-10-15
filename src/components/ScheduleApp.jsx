import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp';

export const ScheduleApp = () => {
    const [payments, setPayments] = useState([]);
    const [van, setvan] = useState();
    const generateSchedule = (numDues, loanAmount, fee, insure, risk, portes, cok) => {
        let pays = [];
        let si = loanAmount;
        cok = Math.pow(1 + (cok / 100), 30 / 360) - 1;
        let sum = 0;
        for (let index = 0; index < numDues; index++) {
            let tep = Math.pow(1 + (fee / 100), 30 / 360) - 1;
            let interes = tep + (insure / 100);
            let cuota = loanAmount * ((interes * Math.pow(1 + interes, numDues)) / (Math.pow(1 + interes, numDues) - 1));
            let i = si * (Math.pow(1 + (fee / 100), 30 / 360) - 1);
            let segDes = (insure / 100) * si;
            let a = cuota - i - segDes;
            let sf = si - a;
            let pp = 0;
            let comision = 0;
            let adminExpense = 0;
            let flujo = cuota + pp + portes + comision + adminExpense + risk;
            sum += (flujo / Math.pow(1 + cok, index + 1));
            pays.push({
                n: index + 1,
                tea: fee,
                tep: (tep) * 100,
                pg: 'S',
                si,
                i,
                cuota,
                a,
                pp: 0,
                segDes,
                segRis: risk,
                comision: 0,
                portes: portes,
                gastAdm: 0,
                sf,
                flujo
            });
            si = sf;
        }
        setvan(sum);
        setPayments(pays);
    }
    useEffect(() => {
        generateSchedule(180, 148530, 10, 0.05, 46.25, 3.5, 25);
    }, [])
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <br />
                        <h4>Indicadores de Rentabilidad</h4>
                        <hr />
                        <table className='table-cost w-100'>
                            <tbody>
                                <tr>
                                    <td>Tasa de Descuento</td>
                                    <td>1.87693%</td>
                                </tr>
                                <tr>
                                    <td>TIR de la operación</td>
                                    <td>0.89251%</td>
                                </tr>
                                <tr>
                                    <td>TCEA de la operación</td>
                                    <td>11.25181%</td>
                                </tr>
                                <tr>
                                    <td>VAN operación</td>
                                    <td>{van && van.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br />
                <br />
                <h4>Cronograma de Pagos</h4>
                <hr />
                <div className="text-right mb-2">
                    <button className='btn btn-info'>Descargar PDF</button>
                    <button className='btn btn-success ml-2'>Descargar EXEL</button>
                </div>
                <div className="table-schedule">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>N°</th>
                                <th style={{ width: '50px' }}>TEA</th>
                                <th style={{ width: '100px' }}>TEM</th>
                                <th>PG</th>
                                <th>Saldo Inicial</th>
                                <th>Interés</th>
                                <th>Cuota</th>
                                <th>Amort.</th>
                                <th>Prepago</th>
                                <th>Seguro  desgrav</th>
                                <th>Seguro de riesgo</th>
                                <th>Comisión</th>
                                <th>Portes</th>
                                <th>Gastos Adm.</th>
                                <th>Saldo Final.</th>
                                <th>Flujo.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0</td>
                                <td colSpan={14}></td>
                                <td>{148530}</td>
                            </tr>
                            {
                                payments.map(pay => (
                                    <tr key={pay.n}>
                                        <td>{pay.n}</td>
                                        <td>{pay.tea} %</td>
                                        <td>{pay.tep.toFixed(5)} %</td>
                                        <td>{pay.pg}</td>
                                        <td>{pay.si.toFixed(2)}</td>
                                        <td>{pay.i.toFixed(2)}</td>
                                        <td>{pay.cuota.toFixed(2)}</td>
                                        <td>{pay.a.toFixed(2)}</td>
                                        <td>{pay.pp}</td>
                                        <td>{pay.segDes.toFixed(2)}</td>
                                        <td>{pay.segRis.toFixed(2)}</td>
                                        <td>{pay.segRis}</td>
                                        <td>{pay.portes}</td>
                                        <td>{pay.gastAdm}</td>
                                        <td>{pay.sf.toFixed(2)}</td>
                                        <td>{pay.flujo.toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <br />
        </>
    )
}
