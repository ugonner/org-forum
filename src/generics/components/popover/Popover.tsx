import { ReactNode, useState } from "react";
import "./popover.css";

interface IPopoverButton {
  buttonText: string;
  handler: Function;
}

export interface IPopoverProps {
  buttons: IPopoverButton[];
  displayElement: ReactNode;
  ariaLabel: string;
}

export const Popover = (prop: IPopoverProps) => {
  const [popoverToggle, setPopoverToggle] = useState(false);
  const callHandler = (handler: Function) => {
    handler();
    setPopoverToggle(false);
  };

  return (
    <div className="popover-top">
      <div className="popover-section row">
        {popoverToggle && (
          <div
            className="popover-container"
            aria-controlledBy="#popover-display-element"
          >
            <ul className="nav navbar navbar-nav">

            {prop.buttons.map((btn) => (
              <li
                className="btn btn-transparent"
                onClick={() => callHandler(btn.handler)}
                role="button"
              >
                {btn.buttonText}
              </li>
            ))}
            </ul>
          </div>
        )}
        <div
          className="popover-display-element"
          onClick={() => setPopoverToggle(!popoverToggle)}
          aria-controls="#popover-container"
          role="button"
          aria-label={prop.ariaLabel ?? ""}
        >
          {prop.displayElement}
        </div>
      </div>
    </div>
  );
};
