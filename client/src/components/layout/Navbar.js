import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email?.split('@')[0] || "User");
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md bg-white bg-opacity-95 sticky-top border-bottom" style={{ backdropFilter: 'blur(12px)', height: '70px' }}>
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary border-0 d-md-none" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
          <h5 className="fw-semibold m-0">Financial Overview</h5>
        </div>

        <div className="d-none d-md-flex align-items-center bg-light rounded-3 px-3 py-2" style={{ maxWidth: '320px', flex: 1 }}>
          <FiSearch className="text-secondary me-2" />
          <input type="text" className="form-control border-0 bg-transparent" placeholder="Search expenses..." />
        </div>

        <div className="d-flex d-md-none align-items-center">
          <button className="btn btn-outline-secondary border-0" onClick={() => setShowMobileSearch(!showMobileSearch)}>
            <FiSearch size={20} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-2 position-relative">
          <button className="btn btn-outline-secondary border-0 position-relative">
            <FiBell size={20} />
            <span className="badge bg-danger rounded-circle position-absolute top-0 end-0 p-1" style={{ fontSize: '8px' }}>3</span>
          </button>

          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '36px', height: '36px' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="d-none d-sm-block">
              <div className="fw-semibold small">{userName}</div>
              <div className="text-secondary small">Premium Member</div>
            </div>
          </div>

          <button className="btn btn-outline-secondary border-0" onClick={handleLogout}>
            <FiLogOut size={20} />
          </button>

          {showDropdown && (
            <div className="dropdown-menu show position-absolute end-0 mt-2" style={{ top: '100%', minWidth: '200px' }}>
              <button className="dropdown-item"><FiUser /> Profile</button>
              <button className="dropdown-item"><FiSettings /> Settings</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger" onClick={handleLogout}><FiLogOut /> Logout</button>
            </div>
          )}
        </div>
      </div>

      {showMobileSearch && (
        <div className="d-md-none px-3 pb-2 bg-white border-bottom">
          <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2">
            <FiSearch className="text-secondary me-2" />
            <input type="text" className="form-control border-0 bg-transparent" placeholder="Search expenses..." />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
