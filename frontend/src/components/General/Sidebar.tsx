import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { logoutUser } from "../../api/auth.api";
import { toast } from "sonner";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";
import { Home, LogOut, User2 } from "lucide-react";
import { Button } from "../ui/Button";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      toast.success(response.message);
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const baseClasses =
    "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex gap-2 justify-center items-center";

  const inactiveClasses = "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground";
  const activeClasses = "bg-primary text-primary-foreground shadow-sm shadow-black/20";
  return (
    <div className="hidden lg:flex w-64 shrink-0 h-full border-r border-border bg-card text-card-foreground flex-col items-center justify-between py-6">
      <div className="flex flex-col gap-4 w-full px-4">
        <NavLink
          to={`/`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Home size={18} />
          Home
        </NavLink>
        <NavLink
          to={`/profile/${loggedInUser?.username}`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <User2 size={18} />
          Profile
        </NavLink>
      </div>
      <div className="w-full px-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
