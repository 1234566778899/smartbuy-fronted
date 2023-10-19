import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp';
import { generatePdfSchedule } from '../utils/pdf/Schedule';
import { closeModal, setVisible, showToastInfo } from '../utils';
import axios from 'axios';

export const ScheduleApp = ({ handleVisible, quotation }) => {
    const [payments, setPayments] = useState([]);
    const [van, setvan] = useState();
    const generateSchedule = () => {
        let { frecuencyPay, days_year, numDues, fee, insure, loanAmount, risk, portes, cok, gastAdm, comision } = quotation;
        let si = loanAmount;
        cok = Math.pow(1 + (cok / 100), frecuencyPay / days_year) - 1;
        let sum = 0;
        let pays = [];
        for (let index = 0; index < numDues; index++) {
            let tep = Math.pow(1 + (fee / 100), 30 / 360) - 1;
            let interes = tep + (insure / 100);
            let cuota = loanAmount * ((interes * Math.pow(1 + interes, numDues)) / (Math.pow(1 + interes, numDues) - 1));
            let i = si * (Math.pow(1 + (fee / 100), 30 / 360) - 1);
            let segDes = (insure / 100) * si;
            let a = cuota - i - segDes;
            let sf = si - a;
            let pp = 0;
            let adminExpense = 0;
            let flujo = cuota + pp + portes + comision + adminExpense + risk + gastAdm;
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
                comision,
                portes: portes,
                gastAdm,
                sf,
                flujo,
            });
            si = sf;
        }
        setvan(sum);
        setPayments(pays);
    }
    useEffect(() => {
        if (quotation) {
            generateSchedule();
        }
    }, [quotation])
    const handleTeaChange = (value, index, key, min = 0, max = 0) => {
        const updatedPayments = [...payments];
        if (min == 0 && max == 0) updatedPayments[index][key] = value;
        else {
            for (let i = min - 1; i < max; i++) {
                updatedPayments[i][key] = value;
            }
        }
        if (value.endsWith('.') || !value) {
            setPayments(updatedPayments);
            return;
        }
        let loanAmount = 148530, insure = 0.05, numDues = 180;
        let si = loanAmount;
        for (let index = 0; index < updatedPayments.length; index++) {
            let pay = updatedPayments[index];
            let fee = parseFloat(pay.tea) || 0;
            let tep = Math.pow(1 + (fee / 100), 30 / 360) - 1;
            let interes = tep + (insure / 100);
            let cuota = 0;
            let i = si * (Math.pow(1 + (fee / 100), 30 / 360) - 1);
            let segDes = (insure / 100) * si;
            let a = 0;
            let sf = 0;
            let flujo = 0;
            let pp = 0;
            if (pay.pg == 'S') {
                cuota = si * ((interes * Math.pow(1 + interes, numDues - index)) / (Math.pow(1 + interes, numDues - index) - 1));
                a = cuota - i - segDes;
                sf = si - a;
                flujo = cuota + pay.pp + pay.portes + pay.comision + pay.gastAdm + pay.segRis;
            } else if (pay.pg == 'T') {
                sf = i + si;
                flujo = cuota + pay.pp + pay.portes + pay.comision + pay.gastAdm + pay.segRis + segDes;
            } else {
                cuota = i;
                sf = si - a - pp;
                flujo = cuota + pay.pp + pay.portes + pay.comision + pay.gastAdm + pay.segRis + segDes;
            }
            updatedPayments[index] = {
                n: index + 1,
                tea: fee,
                tep: (tep) * 100,
                pg: pay.pg,
                si,
                i,
                cuota,
                a,
                pp: 0,
                segDes,
                segRis: pay.segRis,
                comision: 0,
                portes: pay.portes,
                gastAdm: 0,
                sf,
                flujo,
            };
            si = sf;
        }
        setPayments(updatedPayments);
    };
    const changeManyTea = () => {
        let numDues = 180;
        let value = document.querySelector('#select_tea').value;
        let _min = document.querySelector('#inp_min');
        let _max = document.querySelector('#inp_max');
        if (_min.value == '' || _max.value == '') return;
        let min = parseInt(_min.value);
        let max = parseInt(_max.value);
        if (min >= max || min < 0 || max < 0 || max > numDues) return;
        handleTeaChange(value, 0, 'pg', min, max);
        setVisible('#box_pg', false);
        _min.value = '';
        _max.value = ''
    }
    const submitGenerateQuotation = async () => {
        axios.post('http://localhost:4000/quotation/add', quotation)
            .then(r => {
                showToastInfo('Registró exitoso');
            })
            .catch(error => {
                showToastInfo('Error')
            })
    }
    return (
        <>
            <br />
            <div className="d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <i className="fa-solid fa-backward icon" onClick={() => handleVisible()}></i>
                    <h4 className='ml-3'>Cronograma de Pagos</h4>
                </div>
                <button className='btn btn-info' onClick={() => submitGenerateQuotation()}>GENERAR PLAN DE PAGOS</button>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-6">
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
            <div className="table-schedule">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '10px' }}>N°</th>
                            <th style={{ width: '50px' }}>TEA</th>
                            <th style={{ width: '100px' }}>TEM</th>
                            <th className='head-pg'><span className='head-pg-span' onClick={() => setVisible('#box_pg', true)}>PG</span>
                                <div className='box-pg' id='box_pg'>
                                    <div className='d-flex'>
                                        <input type="text" id='inp_min' />
                                        <input type="text" id='inp_max' />
                                        <select id='select_tea'>
                                            <option value="P">P</option>
                                            <option value="T">T</option>
                                            <option value="S">S</option>
                                        </select>
                                    </div>
                                    <div className='d-flex mt-1'>
                                        <button className='cancel' onClick={() => setVisible('#box_pg', false)}>Cancelar</button>
                                        <button className='accept' onClick={() => changeManyTea()}>Aceptar</button>
                                    </div>
                                </div>
                            </th>
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
                            <td>{quotation && quotation.loan_amount}</td>
                        </tr>
                        {
                            payments.map(pay => (
                                <tr key={pay.n}>
                                    <td>{pay.n}</td>
                                    <td><input onChange={(e) => handleTeaChange(e.target.value, pay.n - 1, 'tea')} className='cell-tea' type="text" value={pay.tea.toString()} /> %</td>
                                    <td>{pay.tep.toFixed(5)} %</td>
                                    <td>
                                        <select value={pay.pg} onChange={(e) => handleTeaChange(e.target.value, pay.n - 1, 'pg')} className='cell-pg'>
                                            <option value="P">P</option>
                                            <option value="T">T</option>
                                            <option value="S">S</option>
                                        </select>
                                    </td>
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
            <br />
        </>
    )
}
