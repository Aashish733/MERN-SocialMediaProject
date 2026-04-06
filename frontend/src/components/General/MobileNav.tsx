import { Home, User2, MessageCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";

import MobileChatDrawer from "./MobileChatDrawer";
import MobileSideDrawer from "./MobileSideDrawer";

const MobileNav = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setChatOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const navClasses = "flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors";

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around py-2 lg:hidden z-[100]">
        <Link
          className={navClasses}
          to="/"
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(false);
          }}
        >
          <Home size={24} />
        </Link>

        <button
          className={navClasses}
          onClick={() => {
            setMenuOpen(false);
            setChatOpen(true);
          }}
        >
          <MessageCircle size={24} />
        </button>

        <Link
          className={navClasses}
          to={`/profile/${user?.username}`}
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(false);
          }}
        >
          <User2 size={24} />
        </Link>

        <button
          className={navClasses}
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(true);
          }}
        >
          <Menu size={24} />
        </button>
      </div>

      <MobileChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <MobileSideDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default MobileNav;
