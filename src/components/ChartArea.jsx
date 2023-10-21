import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react';

export const ChartArea = () => {

    useEffect(() => {


        window.google.charts.load('current', { 'packages': ['corechart'] });
        window.google.charts.setOnLoadCallback(drawChart);

    }, []);
    const drawChart = async () => {
        const response = await axios.get('http://localhost:4000/quotation/report');
        let pays = response.data.map(x => {
            let fecha = new Date(x._id.year, x._id.month - 1, x._id.day);
            return [`${moment(fecha, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY")}`, x.count]
        });
        var data = window.google.visualization.arrayToDataTable([
            ['Dias', 'Cantidad',],
            ...pays
        ]);

        var options = {
            title: 'Cotizaciónes realizadas',
            hAxis: { title: 'Fecha', titleTextStyle: { color: '#343A40' } },
            vAxis: { minValue: 0 }
        };

        var chart = new window.google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    return (
        <>
            <div id="chart_div" style={{ width: '100%', height: '450px' }}></div>
        </>
    );
}
