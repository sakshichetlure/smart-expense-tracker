import { NavLink } from "react-router-dom";
import { FaChartPie, FaCreditCard, FaPlus, FaWallet, FaLightbulb } from "react-icons/fa";

function Sidebar({ toggleSidebar }) {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary-gradient rounded-3 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
            <FaWallet className="text-white" size={20} />
          </div>
          <div>
            <h5 className="fw-bold m-0 text-white">SmartTracker</h5>
            <small className="text-secondary" style={{ color: '#94a3b8' }}>Expense Manager</small>
          </div>
        </div>
        <button className="btn-close btn-close-white d-md-none" onClick={toggleSidebar} />
      </div>

      <nav className="flex-grow-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 mb-1 text-secondary ${isActive ? 'active-sidebar text-white' : ''}`
          }
          onClick={toggleSidebar}
        >
          <FaChartPie /> Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 mb-1 text-secondary ${isActive ? 'active-sidebar text-white' : ''}`
          }
          onClick={toggleSidebar}
        >
          <FaCreditCard /> Expenses
        </NavLink>
        <NavLink
          to="/add-expense"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 mb-1 text-secondary ${isActive ? 'active-sidebar text-white' : ''}`
          }
          onClick={toggleSidebar}
        >
          <FaPlus /> Add Expense
          <span className="badge bg-primary-gradient ms-auto">NEW</span>
        </NavLink>
      </nav>

      <div className="pt-3 mt-auto border-top border-secondary border-opacity-25">
        <div className="bg-primary bg-opacity-10 rounded-3 p-3 text-center">
          <FaLightbulb className="text-primary" size={24} />
          <p className="small text-secondary m-0">Save 20% by tracking daily expenses!</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
