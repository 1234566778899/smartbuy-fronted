import React, { useEffect, useRef, useState } from 'react'
import { generatePdfSchedule } from '../utils/pdf/Schedule';
import { setVisible, showToastInfo } from '../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Finance } from 'financejs';
import { CONFI } from '../utils/config';

export const ScheduleApp = ({ handleVisible, quotation }) => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    const [interes, setinteres] = useState(0);
    const [amortizacion, setAmortizacion] = useState(0);
    const [segDes, setSegDes] = useState(0);
    const [segRisk, setSegRisk] = useState(0);
    const [comi, setcomi] = useState(0);
    const [adm, setAdm] = useState(0);
    const [Portes, setPortes] = useState(0);
    const [tir, settir] = useState(0);
    const [tasaDes, settasaDes] = useState(0);
    const [TCEA, setTCEA] = useState();
    const [van, setvan] = useState();
    const [symbol, setSymbol] = useState('');
    const generateSchedule = () => {
        let { frecuencyPay, finalDue, daysYear, numDues, fee, insure, loanAmount, risk, portes, cok, gastAdm, comision, monto } = quotation;
        setSymbol(quotation.currency == 'USD' ? '$' : 'S/.');
        let si = loanAmount;
        cok = Math.pow(1 + (cok / 100), frecuencyPay / daysYear) - 1;
        let sum = 0;
        let pays = [];
        let flows = [-monto];
        settasaDes(cok);
        let totalCuota = 0, totalAmort = 0, totalDes = 0, totalRisk = 0, totalComis = 0, totalPortes = 0, totalAdm = 0;
        for (let index = 0; index < numDues + 1; index++) {
            let tep = Math.pow(1 + fee / 100, frecuencyPay / daysYear) - 1;
            let interes = tep + (insure / 100);
            let cuota = loanAmount * ((interes * Math.pow(1 + interes, numDues)) / (Math.pow(1 + interes, numDues) - 1));
            if (index == numDues) {
                cuota = 0;
                si = 0;
            }
            let i = si * tep;
            totalCuota += cuota;
            let segDes = (insure / 100) * si;
            totalDes += segDes;
            totalRisk += risk;
            totalComis += comision;
            totalPortes += portes;
            totalAdm += gastAdm;
            let a = cuota - i - segDes;
            if (index == numDues) a = 0;
            totalAmort += a;
            let sf = si - a;
            let adminExpense = 0;
            let flujo = cuota + portes + comision + adminExpense + risk + gastAdm;
            if (index == numDues) flujo += finalDue;
            flows.push(flujo);
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
        setinteres(totalCuota - totalAmort - totalDes);
        setAmortizacion(totalAmort + finalDue);
        setSegDes(totalDes);
        setSegRisk(totalRisk);
        setcomi(totalComis);
        setPortes(totalPortes);
        setAdm(totalAdm);
        setvan(monto - sum);
        let finance = new Finance();
        console.log(flows);
        const tir_founded = finance.IRR(...flows);
        settir(tir_founded);
        setTCEA(Math.pow(1 + (tir_founded / 100), daysYear / frecuencyPay) - 1);
        setPayments(pays);
    }
    const cellPg = useRef();
    useEffect(() => {
        generateSchedule();
        const handleCellClick = () => {
            if (cellPg.current) {
                cellPg.current.classList.remove('not-viewed');
            }
        };
        const cell = cellPg.current;
        if (cell) {
            cell.addEventListener('click', handleCellClick);
        }
        return () => {
            if (cell) {
                cell.removeEventListener('click', handleCellClick);
            }
        };
    }, [])
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
        let { numDues, insure, finalDue, loanAmount, risk, comision, portes, gastAdm, frecuencyPay, daysYear, cok, monto } = quotation;
        cok = Math.pow(1 + (cok / 100), frecuencyPay / daysYear) - 1;
        let sum = 0, totalCuota = 0, totalAmort = 0, totalDes = 0, totalRisk = 0, totalComis = 0, totalPortes = 0;
        let flows = [-monto];
        let si = loanAmount;
        for (let index = 0; index < updatedPayments.length; index++) {
            let pay = updatedPayments[index];
            let fee = parseFloat(pay.tea) || 0;
            let tep = Math.pow(1 + fee / 100, frecuencyPay / daysYear) - 1;
            let interes = tep + (insure / 100);
            let cuota = 0;
            let i = si * tep;
            let segDes = (insure / 100) * si;
            totalDes += segDes;
            totalRisk += risk;
            totalComis += comision;
            totalPortes += (portes + gastAdm);
            let a = 0;
            let sf = 0;
            let flujo = 0;
            if (pay.pg == 'S') {
                cuota = si * ((interes * Math.pow(1 + interes, numDues - index)) / (Math.pow(1 + interes, numDues - index) - 1));
                if (index == numDues) cuota = 0;
                a = cuota - i - segDes;
                sf = si - a;
                flujo = cuota + pay.portes + pay.comision + pay.gastAdm + pay.segRis;
            } else if (pay.pg == 'T') {
                sf = i + si;
                flujo = cuota + pay.portes + pay.comision + pay.gastAdm + pay.segRis + segDes;
            } else {
                cuota = i;
                sf = si - a;
                flujo = cuota + pay.portes + pay.comision + pay.gastAdm + pay.segRis + segDes;
            }
            if (index == numDues) flujo += finalDue;
            sum += (flujo / Math.pow(1 + cok, index + 1));
            totalCuota += cuota;
            totalAmort += a;
            flows.push(flujo);
            updatedPayments[index] = {
                n: index + 1,
                tea: fee,
                tep: (tep) * 100,
                pg: pay.pg,
                si,
                i,
                cuota,
                a,
                segDes,
                segRis: pay.segRis,
                comision,
                portes: pay.portes,
                gastAdm,
                sf,
                flujo,
            };
            si = sf;
        }
        setinteres(totalCuota - totalAmort - totalDes);
        setAmortizacion(totalAmort + finalDue);
        setSegDes(totalDes);
        setSegRisk(totalRisk);
        setcomi(totalComis);
        setPortes(totalPortes);
        setvan(monto - sum);
        let finance = new Finance();
        const tir_founded = finance.IRR(...flows);
        settir(tir_founded);
        setTCEA(Math.pow(1 + (tir_founded / 100), daysYear / frecuencyPay) - 1);
        setPayments(updatedPayments);
    };
    const changeManyTea = () => {
        let { numDues } = quotation;
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
        const newCuotation = { ...quotation, totalInterest: interes, totalAmort: amortizacion, totalSegDes: segDes, totalRisk: segRisk, totalComi: comi, totalPortes: Portes, totalAdm: adm, tir, tasaDes, TCEA, van }
        axios.post(`${CONFI.uri}/quotation/add`, { ...newCuotation, flows: payments })
            .then(res => {
                showToastInfo('Registró exitoso');
                navigate(`/quotation/${res.data._id}`);
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error')
            })
    }
    return (
        <div className='summary'>
            <br />
            <div className="d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <i className="fa-solid fa-circle-chevron-left icon" onClick={() => handleVisible()}></i>
                    <h4 className='ml-3'>RESUMEN</h4>
                </div>
                <button className='btn btn-primari' onClick={() => submitGenerateQuotation()}>GENERAR PLAN DE PAGOS</button>
            </div>
            <hr />

            <div className="row">
                <div className="col-md-6">
                    <table className='table-cost w-100'>
                        <tbody>
                            <tr>
                                <td>Intereses</td>
                                <td>{symbol} {interes.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Amortización del capital</td>
                                <td>{symbol} {amortizacion.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Seguro de desgravamen</td>
                                <td>{symbol} {segDes.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Seguro contra todo riesgo</td>
                                <td>{symbol} {segRisk.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Comisiones periodicas</td>
                                <td>{symbol} {comi.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <table className='table-cost w-100'>
                        <tbody>
                            <tr>
                                <td>Portes / Gastos de adm.</td>
                                <td>{symbol} {Portes.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Tasa de Descuento (COKi)</td>
                                <td>{(tasaDes * 100).toFixed(5)}%</td>
                            </tr>
                            <tr>
                                <td>TIR de la operación</td>
                                <td>{tir}%</td>
                            </tr>
                            <tr>
                                <td>TCEA de la operación</td>
                                <td>{(TCEA * 100).toFixed(2)}%</td>
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
                            <th style={{ width: '60px' }}>TEA</th>
                            <th style={{ width: '100px' }}>TEM</th>
                            <th ref={cellPg} className='head-pg not-viewed'><span className='head-pg-span' onClick={() => setVisible('#box_pg', true)}>PG</span>
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
                            <td colSpan={13}></td>
                            <td>{quotation && quotation.monto.toFixed(2)}</td>
                        </tr>
                        {
                            payments.map(pay => (
                                <tr key={pay.n}>
                                    <td>{pay.n}</td>
                                    <td><input onChange={(e) => handleTeaChange(e.target.value, pay.n - 1, 'tea')} className='cell-tea' type="text" value={pay.tea ? pay.tea : ''} /> %</td>
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
                                    <td>{pay.segDes.toFixed(2)}</td>
                                    <td>{pay.segRis.toFixed(2)}</td>
                                    <td>{pay.comision}</td>
                                    <td>{pay.portes}</td>
                                    <td>{pay.gastAdm.toFixed(2)}</td>
                                    <td>{pay.sf.toFixed(2)}</td>
                                    <td>{pay.flujo.toFixed(2)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <br />
        </div>
    )
}
