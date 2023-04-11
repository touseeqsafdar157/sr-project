import { divide } from "lodash";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({ children, header, list, button_color_class, disabled, isRequirment }) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current) {
        if (ref.current?.contains(event.target)) {
          return;
        }
      }
      setDisplayDropdown(false);
    };
    document.body.addEventListener("click", onBodyClick);
    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`dropdown ${displayDropdown && "show"}`}
      onClick={(e) => setDisplayDropdown(true)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={displayDropdown.toString()}
        className={`dropbtn btn ${button_color_class}`}
        disabled={disabled}
      >
        {header}
        <span>
          <i className="icofont icofont-arrow-down"></i>
        </span>
      </button>
      <div
        tabindex="-1"
        role="menu"
        aria-hidden={!displayDropdown.toString()}
        className={`dropdown-content dropdown-menu ${
          displayDropdown && "show"
        }`}
        style={
          displayDropdown
            ? {
                position: "absolute",
                willChange: "transform",
                top: isRequirment? '-12px' : "0px",
                left: isRequirment ? '12px' : "-100px",
                transform: "translate3d(0px, 54px, 0px)",
                maxHeight: isRequirment? '260px' : '',
                overflowY: isRequirment ? 'scroll' : '',
                overflowX: isRequirment? 'hidden' : ''
              }
            : {}
        }
      >
        {list.map((item) => (
          <button
            type="button"
            tabindex="0"
            role="menuitem"
            className="dropdown-item"
            onClick={item.function}
            style={{ cursor: "pointer" }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
