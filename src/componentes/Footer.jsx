import React, { useState } from 'react';
import '../estilos/footer.css';
import logo_facebook from '../imagenes/logo_facebook.png';
import logo_instagram from '../imagenes/logo_instagram.png';
import logo_x from '../imagenes/logo_x.png';

const Footer = () => {
    return (
        <div className="footer">
            <p className='copyright'>© 2023 Parador. Todos los derechos reservados. <br />
                Trabajo realizado por: Cancino Ignacio Matias, <br />Maceda Tiziano, Patti Mauro.</p>
            
            <h1>EL PARADOR <p className='tm'>™</p></h1>
            <div className='redes'>
            <a href="https://www.youtube.com/watch?v=W_hsGsd39Kg"><img src={logo_facebook}/> </a>
            <a href="https://www.instagram.com/misetery/"><img src={logo_instagram}/></a>
            <a href="https://x.com/Misetery2"><img src={logo_x}/></a>
            </div>
        </div>
    )
}

export default Footer;