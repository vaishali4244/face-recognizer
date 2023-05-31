import React from 'react';
import './Rank.css'

const Rank = ({ name, entries }) => {
    return (
        <div className='entry'>
            <div className='near-black b entry'>
                {`${name.charAt(0).toUpperCase() + name.slice(1)}, your total entry count is ...`}
            </div>
            <div className='black f2 entry'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;