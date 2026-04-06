import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { searchPosts } from "../../api/post.api";
import type { SearchPost } from "../../types/searchPost";
import { Avatar } from "../ui/Avatar";
import { Input } from "../ui/Input";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchPosts(query);
        setResults(response);
        setOpen(true);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  /* ---------------- CLICK OUTSIDE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="h-[60px] flex justify-between items-center px-4 md:px-20 border-b border-border bg-background">
        <Link to="/" className="text-primary font-bold text-xl md:text-3xl tracking-tight">
          ConnectHub
        </Link>

        {/* -------- Desktop Search -------- */}
        <div
          ref={searchRef}
          className="relative w-[50%] max-w-md hidden sm:block"
        >
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background h-9 rounded-full"
            />
          </div>

          {open && (
            <div className="absolute mt-2 w-full bg-popover text-popover-foreground border border-border rounded-xl shadow-md max-h-80 overflow-y-auto z-50">
              {loading && (
                <p className="text-center py-4 text-muted-foreground text-sm">Searching...</p>
              )}

              {!loading &&
                results.map((p) => (
                  <Link
                    key={p._id}
                    to={`/${p._id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <Avatar src={p.owner.profileImage} alt={p.owner.username} />

                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {p.owner.username}
                      </p>

                      {p.content && (
                        <p className="text-muted-foreground text-xs truncate">
                          {p.content.replace(/<[^>]*>?/gm, '')}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* -------- Profile + Mobile Search -------- */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Icon */}
          <Search
            className="text-muted-foreground hover:text-foreground sm:hidden cursor-pointer transition-colors"
            size={22}
            onClick={() => setMobileSearchOpen(true)}
          />

          <Link to={`/profile/${user?.username}`}>
            <Avatar 
              src={user?.profileImage} 
              alt={user?.username} 
              className="border-2 border-primary"
            />
          </Link>
        </div>
      </nav>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur z-[100] p-4 sm:hidden">
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <Search size={16} className="absolute left-3 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-9 bg-muted/50 rounded-full h-10"
                />
              </div>

              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setQuery("");
                  setOpen(false);
                }}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {open && (
              <div className="mt-3 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg max-h-[70vh] overflow-y-auto">
                {loading && (
                  <p className="text-center py-4 text-muted-foreground text-sm">Searching...</p>
                )}

                {!loading &&
                  results.map((p) => (
                    <Link
                      key={p._id}
                      to={`/${p._id}`}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                    >
                      <Avatar src={p.owner.profileImage} alt={p.owner.username} />

                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {p.owner.username}
                        </p>

                        {p.content && (
                          <p className="text-muted-foreground text-xs truncate">
                            {p.content.replace(/<[^>]*>?/gm, '')}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
