import React, { useState, useRef, useEffect } from "react";
import infoIcon from "../assets/images/infoIcon.svg";
import selector from "../assets/images/selector.svg";

export default function Input({ label, type, name, onChange, error, value, min, classname, inputClassName,
  placeholder, valueOfInput, checked, forceLabelClass, info, infoMessage, isMobile = false, disabled = false }) {
  const imgRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    let refValue = imgRef.current;
    if (imgRef && imgRef.current && !isMobile) {
      refValue.addEventListener("mouseover", () => {
        setShowInfo(true);
      });
      refValue.addEventListener("mouseout", () => {
        setShowInfo(false);
      });
    }
    return () => {
      if (refValue) {
        refValue.removeEventListener("mouseover", () => {
        });
      }
    };
  }, [imgRef]);

  const defineClass = () => {
    switch (type) {
      case "text":
        return "input";
      case "radio":
        return "input-flex";
      case "number":
        return "input-number";
      case "file":
        return "input-file";
      default:
        return "input";
    }
  };

  return (
    <>
      <div className={`${defineClass()}`}>
        <label
          htmlFor={name}
          className={`input-label ${forceLabelClass ? forceLabelClass : ""}`} >
          <div
            className="flex align-items"  >
            <span>
              {label} {valueOfInput ? valueOfInput : null}
            </span>
            {info && !isMobile ?
              <div style={{ position: "relative" }}>
                <img
                  src={infoIcon}
                  width='20px'
                  alt='info icon'
                  className='input-info'
                  ref={imgRef} />
                {infoMessage && showInfo ?
                  <div className='input-message'>
                    {infoMessage}
                  </div>
                  : null
                }
              </div>
              : info && isMobile
                ? <button
                  className={`collapse-toggle${showInfo ? "-active" : ""}`}
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <img
                    src={selector}
                    className="rotate-90"
                    alt='show additional information'
                    width='10px'
                    height='10px' />
                </button>
                : null
            }

          </div>
        </label>
        {isMobile && showInfo
          ? <span
            className="padding-10-vert block"
          >{infoMessage}</span>
          : null
        }
        {
          type !== "textArea"
            ? <input
              type={type || "text"}
              name={name}
              id={name}
              onChange={onChange}
              value={value}
              className={inputClassName}
              checked={checked}
              placeholder={placeholder}
              min={min}
              disabled={disabled}
              accept='image/*'
              multiple
            />
            :
            <textarea
              name={name}
              id={name}
              onChange={onChange}
              value={value}
              className={inputClassName ? `input-textarea ${inputClassName}` : "input-textarea"}
              placeholder={placeholder}
            />
        }

        <span className='input-error'>{error ? error : null}</span>
      </div>

    </>
  );
}
