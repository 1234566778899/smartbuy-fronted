import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdfSchedule = (payments, loanAmount) => {
    const mainConfig = {
        unit: "pt",
        orientation: "p",
        format: 'a4',
    };
    const doc = new jsPDF(mainConfig);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PLAN DE PAGOS POR EL MÉTODO FRANCES VENCIDO ORDINARIO (30 DÍAS)", pageWidth / 2, 40, { align: 'center' });

    const layout = {
        head: [
            [
                'N°', 'PG', 'SALDO INICIAL', 'INTERÉS', 'CUOTA', 'AMORT.', 'SEG. DESGRAV', 'SEG. DE RIESGO', 'COMISIÓN', 'PORTES', 'GASTOS ADM.', 'SALDO FINAL.', 'FLUJO'
            ],
        ],
        body: [
            [
                '0',
                {
                    content: '',
                    colSpan: 11
                },
                loanAmount
            ],
            ...payments.map(pay => (
                [
                    pay.n, pay.pg, pay.si.toFixed(2), pay.i.toFixed(2), pay.cuota.toFixed(2), pay.a.toFixed(2), pay.segDes.toFixed(2), pay.segRis.toFixed(2), pay.comision, pay.portes.toFixed(2), pay.gastAdm.toFixed(2), pay.sf.toFixed(2), pay.flujo.toFixed(2)
                ]
            ))
        ],
    };

    const colors = {
        black: [0, 0, 0],
        white: [255, 255, 255],
        blue: [0, 72, 151],
        light_blue: [217, 225, 242],
        darkgray: [169, 169, 169]
    }

    const margin = 20;

    let positionY = 60
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
        ...layout,
        theme: "grid",
        margin,
        layout,
        ...optionsForm,
    })

    doc.output('dataurlnewwindow');
}
