import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const Scheduler = () => {
  return (
    <div>
    <div>Scheduler</div>
    <Popup trigger={<button> Trigger</button>} position="right center">
    <div>Popup content here !!</div>
    <button className="btn btn-success " ><i className="fas fa-plus"></i> Add Redaction</button>
        <button className='btn btn-success '><i className="fas fa-check"></i> Accept All</button>
        <button className='btn btn-success '><i className="fas fa-bookmark"></i> Save</button>
        <button className='btn btn-success '><i className="fas fa-arrow-left-long"></i> Redo</button>
        <button className='btn btn-success '><i className="fas fa-x"></i>  Cancel</button>
        <button className='btn btn-success '><i className="fas fa-scissors"></i>  Deselect</button>
        <button className='btn btn-success '><i className="fas fa-location-arrow"></i> Process</button>
  </Popup>
  
  </div>
  )
}

export default Scheduler;