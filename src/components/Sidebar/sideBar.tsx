import { useEffect, useState } from "react";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import { sidebarJson } from "./navbarJson";
import { Button, Icon, Intent } from "@blueprintjs/core";
import { AIFoundryFull, AIFoundry } from "../../assets/AIFoundry";
import { IconNames } from "@blueprintjs/icons";
import "./Sidebar.scss";

const Sidebar = () => {
  const [isExpanded, setExpendState] = useState(false);
  const [navJason, setNavJason] = useState(sidebarJson);
  const [dropdownHandlerForProjects, setDropdownHandlerForProjects] = useState(false);
  const [dropdownHandle, setDropdownHandle] = useState(false);

  const navigate = useNavigate();




  const handleNavigation = () => {
    navigate('/Projects');
  }

  const handleDropdownhandlerForProjects = (item:string) => {
    console.log(dropdownHandle);
    if(item != '/Projects' || '/Test-Case' || '/Test-Set' || '/Execution'){
      setDropdownHandle(false);
    }else{
      setDropdownHandle(true);
    }
  }

  return (
    <div
      className={
        isExpanded ? "sidebarContainer open" : "sidebarContainer collapsed"
      }
    >
      <div className={`brandingSection ${isExpanded ? "open" : "closed"}`}>
        {/* <h2 className="logo">{isExpanded ? <TidiumFull /> : <TidiumLogo />}</h2> */}
        <h2 className="logo">{isExpanded ? <AIFoundryFull /> : <AIFoundry />}</h2>
        <span className="toggler" onClick={() => setExpendState(!isExpanded)}>
          {isExpanded ? (
            <Icon icon="chevron-left" className="sidebarToggle" />
          ) : (
            <Icon icon="chevron-right" className="sidebarToggle" />
          )}
        </span>
      </div>
      <ul className="navItems">
        {navJason.map((item, value) => {
          return (
            <li className={dropdownHandlerForProjects ? "list" : 'li'} key={value}>
              {item.subMenu.length === 0 ? (
                <NavLink key={value} to={item.path} onClick={() => {setDropdownHandlerForProjects(false);handleDropdownhandlerForProjects(item.path)}} className="menu-item">
                  <div className="tooltip1">
                    <div
                      className="tooltip"
                      data-toottip={isExpanded ? "" : item.name}
                    >
                      <Icon icon={item.icon} />
                      {/* <i class="fa-solid fa-file"></i> */}

                    </div>
                  </div>
                  {isExpanded && item.name}
                  {isExpanded && item.subMenu.length !== 0 && (
                    <Icon
                      className="drop-down-icon"
                      icon={IconNames.DoubleChevronDown}
                    />
                  )}
                </NavLink>
              ) : (
                <div
                  key={value}
                  onClick={() =>
                    {
                      handleDropdownhandlerForProjects(item.path);
                      setDropdownHandlerForProjects(!dropdownHandlerForProjects);
                      // handleNavigation();
                    }
                  }
                  className={dropdownHandlerForProjects ? "menu-item-open" : "menu-item"}
                >
                  <div className="tooltip1">
                    <div
                      className="tooltip"
                      data-toottip={isExpanded ? "" : item.name}
                    >
                      <Icon icon={item.icon} />
                    </div>
                  </div>
                  {isExpanded && item.name}
                  {isExpanded &&
                  item.subMenu.length !== 0 && 
                  (dropdownHandlerForProjects ? (
                    <Icon
                      className="drop-down-icon"
                      icon={IconNames.ChevronUp}
                    />
                  ) : (
                    <Icon
                      className="drop-down-icon"
                      icon={IconNames.ChevronDown}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
