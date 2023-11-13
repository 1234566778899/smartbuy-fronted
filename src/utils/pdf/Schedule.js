import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export const generatePdfSchedule = (payments, quotation) => {
    const mainConfig = {
        unit: "pt",
        orientation: "p",
        format: 'a4',
    };
    const doc = new jsPDF(mainConfig);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width;
    const positionY = 100;
    let fechaActual = new Date();
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let anio = fechaActual.getFullYear();
    let fechaFormateada = `${dia}/${mes}/${anio}`;
    const colors = {
        black: [0, 0, 0],
        white: [255, 255, 255],
        blue: [0, 72, 151],
        light_blue: [217, 225, 242],
        darkgray: [169, 169, 169]
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.addImage('https://i.postimg.cc/KYNJ3tsn/logo.png', 'PNG', pageWidth / 2 - 20, 10, 40, 40, 'alias', 'FAST', 0);

    doc.text("PLAN DE PAGOS POR EL MÉTODO FRANCES VENCIDO ORDINARIO", pageWidth / 2, 65, { align: 'center' });
    doc.text(`Fecha: ${fechaFormateada}`, pageWidth - 70, 95, { align: 'center' });
    const symbol = quotation.currency == 'USD' ? '$' : 'S/.';
    const getDescripPeriGr = () => {
        let flows = payments;
        let p = [], t = [];
        let otro_p = false, otro_t = false;

        for (let i = 0; i < flows.length; i++) {
            if (flows[i].pg === 'P' && !otro_p) {
                p.push({
                    inicio: i + 1,
                    fin: null
                });
                otro_p = true;
            } else if (flows[i].pg === 'P' && otro_p) {
                p[p.length - 1].fin = i + 1;
            } else {
                otro_p = false;
            }

            if (flows[i].pg === 'T' && !otro_t) {
                t.push({
                    inicio: i + 1,
                    fin: null
                });
                otro_t = true;
            } else if (flows[i].pg === 'T' && otro_t) {
                t[t.length - 1].fin = i + 1;
            } else {
                otro_t = false;
            }
        }
        const formatPeriod = (period) => `(${period.inicio}${period.fin ? `-${period.fin}` : ''})`;
        const cadParcial = p.length ? `Parcial ${p.map(formatPeriod).join(',')}` : '';
        const cadTotal = t.length ? `Total ${t.map(formatPeriod).join(',')}` : '';
        if (!cadParcial && !cadTotal) return 'No aplica';
        return `${cadParcial} ${cadTotal}`.trim();
        
    }

    const info = {
        head: [
            [
                {
                    content: 'Datos del cliente',
                    colSpan: 2,
                    styles: {
                        halign: 'start'
                    }
                }
            ]
        ],
        body: [
            [
                'Nombre completo:',
                `${quotation.customer.name} ${quotation.customer.lname}`
            ],
            [
                'Tipo y número de documento:',
                `${quotation.customer.documentType == 'DNI' ? 'DNI' : (quotation.customer.documentType == 'P' ? 'Pasaporte' : 'Carné de extranjería')} - ${quotation.customer.documentNumber}`
            ],
            [
                'Dirección:',
                `${quotation.customer.address}`
            ],
            [
                'Teléfono y email:',
                `${quotation.customer.telephone} - ${quotation.customer.email}`
            ],
            [
                {
                    content: 'Información del Vehículo',
                    colSpan: 2,
                    styles: {
                        fillColor: colors.darkgray,
                        fontStyle: 'bold'
                    }
                }
            ],
            [
                'Marca y Modelo:',
                `${quotation.car.brand} ${quotation.car.model}`
            ],
            [
                'Precio del vehículo:',
                `$ ${quotation.car.price}`
            ],
            [
                'Año/Fabricación:',
                `${quotation.car.yearManufactured}`
            ],
            [
                'Color y otros detalles relevantes:',
                `${quotation.car.color}, ${quotation.car.otherDetails}`
            ],
            [
                {
                    content: 'Condiciones Financieras',
                    colSpan: 2,
                    styles: {
                        fillColor: colors.darkgray,
                        fontStyle: 'bold'
                    }
                }
            ],
            [
                'Moneda de la cotización:',
                `${quotation.currency == 'USD' ? 'Dolares' : 'Soles'}`
            ],
            [
                'Cuota inicial:',
                `${symbol} ${quotation.initialDue}`
            ],
            [
                'Cuota final:',
                `${symbol} ${quotation.finalDue}`
            ],
            [
                'Costos/Gastos iniciales',
                `${symbol} ${quotation.initialCost}`
            ],
            [
                'Monto del prestamo:',
                `${symbol} ${quotation.monto.toFixed(2)}`
            ],
            [
                'Saldo a financiar con cuotas:',
                `${symbol} ${quotation.loanAmount.toFixed(2)}`
            ],

            [
                'Tasa de interés:',
                `${quotation.fee.toFixed(2)}% anual (efectiva)`
            ],
            [
                'Número de cuotas:',
                `${quotation.numDues}`
            ],
            [
                'Periodo de gracia:',
                `${getDescripPeriGr()}`
            ],
            [
                {
                    content: 'Indicadores Financieros',
                    colSpan: 2,
                    styles: {
                        fillColor: colors.darkgray,
                        fontStyle: 'bold'
                    }
                }
            ],
            [
                'Tasa de descuento (COK):',
                `${((Math.pow(1 + (quotation.cok / 100), quotation.frecuencyPay / quotation.daysYear) - 1) * 100).toFixed(4)} %`
            ],
            [
                'Valor Actual Neto (VAN):',
                `${quotation.van.toFixed(2)}`
            ],
            [
                'Tasa Interna de Retorno (TIR):',
                `${quotation.tir} %`
            ],
            [
                {
                    content: 'Totales',
                    colSpan: 2,
                    styles: {
                        fillColor: colors.darkgray,
                        fontStyle: 'bold'
                    }
                }
            ],
            [
                'Intereses:',
                `${symbol} ${quotation.totalInterest.toFixed(2)}`
            ],
            [
                'Amortización del capital:',
                `${symbol} ${quotation.totalAmort.toFixed(2)}`
            ],
            [
                'Seguro de desgravamen:',
                `${symbol} ${quotation.totalSegDes.toFixed(2)}`
            ],
            [
                'Seguro contra todo riesgo:',
                `${symbol} ${quotation.totalRisk.toFixed(2)}`
            ],
            [
                'Comisiones periodicas:',
                `${symbol} ${quotation.totalComi.toFixed(2)}`
            ],
            [
                'Portes / Gastos de adm:',
                `${symbol} ${quotation.totalPortes.toFixed(2)}`
            ],
        ]
    }
    const layout = {
        head: [
            [
                {
                    content: 'Cronograma de pagos',
                    colSpan: 13
                }
            ],
            [
                'N°', 'PG', 'Saldo inicial', 'Interés', 'Cuota', 'Amort.', 'Seg. desgrav.', 'Seg. de riesgo', 'Comisión', 'Portes', 'Gastos de adm.', 'Saldo final.', 'Flujo'
            ],
        ],
        body: [
            [
                '0',
                {
                    content: '',
                    colSpan: 11
                },
                quotation.loanAmount.toFixed(2)
            ],
            ...payments.map(pay => (
                [
                    pay.n, pay.pg, pay.si.toFixed(2), pay.i.toFixed(2), pay.cuota.toFixed(2), pay.a.toFixed(2), pay.segDes.toFixed(2), pay.segRis.toFixed(2), pay.comision, pay.portes.toFixed(2), pay.gastAdm.toFixed(2), pay.sf.toFixed(2), pay.flujo.toFixed(2)
                ]
            ))
        ],
    };



    const margin = 20;


    const optionsForm = {
        tableLineColor: colors.black,
        tableLineWidth: 0.1,
        headStyles: {
            lineColor: colors.black,
            lineWidth: 0.1,
            fillColor: colors.darkgray,
            fontSize: 8,
            halign: "center",
            textColor: colors.black,
        },
        bodyStyles: {
            lineColor: colors.black,
            fontSize: 8,
            lineWidth: 0.1,

            textColor: colors.black,
        },
        styles: {
            lineColor: colors.black,
        },
    }
    autoTable(doc, {
        startY: positionY,
        ...info,
        theme: "grid",
        margin,
        layout,
        ...optionsForm,
    })
    autoTable(doc, {
        startY: doc.autoTable.previous.finalY + 170,
        ...layout,
        theme: "grid",
        margin,
        layout,
        ...optionsForm,
    })

    doc.output('dataurlnewwindow');
}
