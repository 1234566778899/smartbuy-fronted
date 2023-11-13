import React from 'react'
import { NavApp } from './NavApp'

export const InfoApp = () => {
    return (
        <div className='summary'>
            <NavApp logged={true} />
            <br />
            <div className="container pr-5">
                <h4>¿Cómo funciona el crédito automotriz inteligente?</h4>
                <hr />
                <p>La compra inteligente de autos te permite pagar en cuotas entre el 30% y el 40% del vehículo en un plazo de 24 o 36 meses, según lo prefieras. Durante este período, la cuota a pagar tiene incluidas las tasas de intereses y gastos operacionales correspondientes al valor total financiado.</p>
                <p>Una vez que se cumple el plazo del crédito automotriz inteligente, tienes un saldo del 40% o 50% del valor del vehículo (VFMG), que puedes elegir dentro de tres alternativas para pagar:
                </p>
                <h5>Alternativa 1 | Renovar el vehículo</h5>
                <p>La compra inteligente de autos está diseñado para los que les gusta cambiar de auto con frecuencia. Por eso la primera alternativa que tienes es renovar tu vehículo accediendo a un nuevo crédito.</p>
                <p>En este caso, la automotora tasa el auto para recibirlo como parte de pago del saldo que tienes. Si la tasación del auto es mayor al valor de la deuda, tendrás un dinero a tu favor para usar como pie para tu nuevo auto.</p>
                <p>La gran ventaja es sacarle provecho a un auto durante sus mejores años y luego optar nuevamente por un 0 km con cuotas cómodas. Es importante que evalúes que en algún momento vas a tener que cerrar el ciclo y decidir entre quedarte el vehículo, entregarlo o venderlo. A continuación te explicamos las alternativas que tienes:</p>
                <h5>Alternativa 2 | Quedarte con el auto</h5>
                <p>Al financiar un vehículo con el crédito automotriz inteligente, también tienes la opción de quedarte con él, luego de haber pagado todas las cuotas. Para hacerlo, tienes que pagar un cuotón que equivale al 50% o 40% del valor total del auto cuando estaba nuevo. Este valor es informado al momento de la venta, se denomina VFMG (Valor Futuro Mínimo Garantizado) y corresponde al valor que tendrá tu auto dentro de dos o tres años, según sea el plazo del crédito.</p>
                <p>El cuotón lo puedes refinanciar, pagar con recursos propios o solicitar un crédito a otra institución financiera. La desventaja de esta alternativa es que al sumar el pie inicial (lo pagado en el crédito y el cuotón), el costo total que pagues por el auto será mucho mayor que sí lo comprabas con un crédito convencional.</p>
                <p>A menos que tengas la posibilidad de venderlo a un precio mucho mejor que el que paga la automotora, esta alternativa no es muy conveniente para tu bolsillo.
                </p>
                <h5>Alternativa 3 | Devolver el auto</h5>
                <p>Si al finalizar el pago de tu crédito automotriz inteligente no quieres quedarte con el auto, ni adquirir uno nuevo, tienes la opción de regresar el vehículo.</p>
                <p>Para esta transacción la automotora tasa tu auto para recibirlo como parte de pago y saldar tu crédito. De la misma manera que en la Alternativa 1, en caso que el VFMG sea menor a la tasación del auto, tendrás un saldo a tu favor que te van a devolver.</p>
            </div>
            <br />
        </div>
    )
}
