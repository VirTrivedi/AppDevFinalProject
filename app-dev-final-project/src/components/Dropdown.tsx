import React, { useState } from 'react';


const DropdownWindow = () => { // how do i transfer content into this

  const [isOpen, setIsOpen] = useState(false);


  const toggleWindow = () => {
    setIsOpen(prevState => !prevState);
  };


  return (
    <div>
      <button onClick={toggleWindow} className="dropdown-button">
        Open Dropdown Window
      </button>

      {isOpen && (
        <div
          className="dropdown-window-overlay"
        >
          <div className="dropdown-window">
            <h2>Dropdown Window</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownWindow;
