import React from 'react';
import Navbar from './Navbar';
import '../estilos/Acerca.css';
import WhatsAppButton from './WhatsappButton';
import { useInView } from 'react-intersection-observer';
import Restobar2 from '../imagenes/restobar2.png';
import Restobar3 from '../imagenes/restobar3.png';
import Restobar4 from '../imagenes/restobar4.png';
import Footer from './Footer';

const AcercaDeNosotros = () => {
  const { ref: imageRef1, inView: imageInView1 } = useInView({ triggerOnce: true });
  const { ref: imageRef2, inView: imageInView2 } = useInView({ triggerOnce: true });
  const { ref: imageRef3, inView: imageInView3 } = useInView({ triggerOnce: true });

  return (
    <>
      <Navbar />
      <div className='section2'>
      <div className='section'>
        <h1>
          <u> Acerca de Nosotros</u>
        </h1>
        <p>
          Bienvenidos a <b>"El Parador"</b>, un lugar donde la pasión por la buena comida y la hospitalidad se unen para ofrecerte una experiencia gastronómica inolvidable. Ubicado en el corazón de
          <b> San Miguel De Tucuman</b>, nuestro restaurante es un rincón acogedor donde cada platillo cuenta una historia y cada ingrediente es seleccionado con el mayor cuidado.
        </p>
        </div>
      </div>
        <WhatsAppButton />
      <div className='images-section'>
        <img
        style={{marginRight: '50%'}}
          ref={imageRef1}
          src={Restobar2}
          className={`fade-in ${imageInView1 ? 'visible' : ''}`}
        />
        <h1 style={{marginLeft: '50%',marginTop: '120px',color:'white',fontFamily:'italic'}}>"La mejor calidad en vinos y comida"</h1>
        <img
          style={{marginLeft: '50%'}}
          ref={imageRef2}
          src={Restobar3}
          className={`fade-in ${imageInView2 ? 'visible' : ''}`}
        />
        <h1 style={{marginRight: '50%',marginTop: '120px',color:'white',fontFamily:'italic'}}>"El mejor sabor tucumano"</h1>
        <img
          style={{marginRight: '50%'}}
          ref={imageRef3}
          src={Restobar4}
          className={`fade-in ${imageInView3 ? 'visible' : ''}`}
        />
        <div className='texto1'>
         <h2>"La calidad de nuestros platos es nuestro mayor compromiso"</h2>
       </div>
      </div>
       <Footer/>
    </>
  );
};

export default AcercaDeNosotros;