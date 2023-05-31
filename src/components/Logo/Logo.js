import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import bulb from './bulb.png';

const Logo = () => {
    return (
        <div className="ma4 mt0 " >
            <Tilt className="tilt shadow-2" style={{ height: '150px', width: '150px' }} options={{ max: 25 }} >
                <div >
                  <img style={{paddingTop: '4px'}} src={bulb} alt="" height='140px'/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;