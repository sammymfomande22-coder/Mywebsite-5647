import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
  PawPrint,
  Waves,
} from "lucide-react";
import { categories, money, products, type Product } from "../lib/catalog";
import { PoolServices, QuoteForm } from "../components/pool-services";

type Cart = Record<number, number>;
function stored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function useModal(active: boolean, close: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("button,input,select")?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,select,a[href]",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [active, close]);
  return ref;
}
export default function Storefront() {
  const [cart, setCart] = useState<Cart>(() => stored("paws-pools-cart", {}));
  const [favorites, setFavorites] = useState<number[]>(() => stored("paws-pools-favorites", []));
  const [panel, setPanel] = useState<"cart" | "wishlist" | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [info, setInfo] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("Best Sellers");
  const [sort, setSort] = useState("Featured");
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [end] = useState(() => {
    const saved = stored<number>("paws-pools-deal-end", 0);
    const value = saved || Date.now() + (8 * 3600 + 42 * 60 + 18) * 1000;
    localStorage.setItem("paws-pools-deal-end", JSON.stringify(value));
    return value;
  });
  const [remaining, setRemaining] = useState(Math.max(0, Math.floor((end - Date.now()) / 1000)));
  const closeModals = useCallback(() => {
    setPanel(null);
    setDetail(null);
    setInfo(false);
    setQuote(null);
  }, []);
  const modalRef = useModal(!!panel || !!detail || info || !!quote, closeModals);
  useEffect(() => {
    localStorage.setItem("paws-pools-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("paws-pools-favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    const id = setInterval(
      () => setRemaining(Math.max(0, Math.floor((end - Date.now()) / 1000))),
      1000,
    );
    return () => clearInterval(id);
  }, [end]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const add = (p: Product) => {
    setCart((prev) => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
    setToast(`${p.name} added to your bag`);
  };
  const change = (id: number, delta: number) =>
    setCart((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) };
      if (!next[id]) delete next[id];
      return next;
    });
  const favorite = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const browse = (cat = "All", name = "Best Sellers") => {
    setCategory(cat);
    setCollection(name);
    setQuery("");
    setCategoryOpen(false);
    setMenuOpen(false);
    setTimeout(
      () =>
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };
  let filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category || p.group === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (collection !== "Flash Deals" || !!p.original) &&
      (collection !== "New Arrivals" || p.badge === "New"),
  );
  if (category === "All" && !query && collection === "Best Sellers")
    filtered = filtered.slice(0, 6);
  if (sort === "Price: low to high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "Price: high to low") filtered.sort((a, b) => b.price - a.price);
  if (sort === "Top rated") filtered.sort((a, b) => b.rating - a.rating);
  const displayTitle = query
    ? `Results for “${query}”`
    : category !== "All"
      ? category
      : collection;
  const goServices = () => {
    setMenuOpen(false);
    setCategoryOpen(false);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const openQuote = (service: string) => {
    closeModals();
    setQuote(service);
  };
  const clock = [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60];
  const close = () => {
    setPanel(null);
    setDetail(null);
    setInfo(false);
    setQuote(null);
  };
  return (
    <div className="storefront">
      <div className="announcement">
        <span>
          <Truck size={14} /> Free shipping on orders over $50
        </span>
        <span className="announcement-sale">
          <Zap size={13} /> Backyard favorites. Up to 24% off.{" "}
          <button onClick={() => browse("All", "Flash Deals")}>
            Shop the sale <ArrowRight size={13} />
          </button>
        </span>
        <span>Happy pets. Clear pools.</span>
      </div>
      <header className="header wrap">
        <button
          className="logo"
          onClick={() => {
            browse();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <PawPrint size={25} strokeWidth={2} /> Paws <span>&</span> Pools
        </button>
        <nav
          className={menuOpen ? "navigation mobile-open" : "navigation"}
          aria-label="Main navigation"
        >
          <button
            className="active"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </button>
          <button onClick={() => browse("Pet supplies", "Shop All")}>Pet supplies</button>
          <button onClick={() => browse("Pool supplies", "Shop All")}>Pool supplies</button>
          <button onClick={goServices}>Pool cleaning</button>
          <div className="category-nav">
            <button onClick={() => setCategoryOpen(!categoryOpen)} aria-expanded={categoryOpen}>
              Categories <ChevronDown size={12} />
            </button>
            {categoryOpen && (
              <div className="nav-dropdown">
                {categories.map((c) => (
                  <button key={c.name} onClick={() => (c.service ? goServices() : browse(c.name))}>
                    {c.name}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setInfo(true)}>About us</button>
        </nav>
        <div className="header-actions">
          <button
            aria-label="Search products"
            className="icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={21} />
          </button>
          <button
            aria-label="Open wishlist"
            className="icon-button wishlist-icon"
            onClick={() => setPanel("wishlist")}
          >
            <Heart size={21} />
            {favorites.length > 0 && <i>{favorites.length}</i>}
          </button>
          <span className="header-divider" />
          <button
            aria-label={`Open cart, ${count} items`}
            className="icon-button bag-button"
            onClick={() => setPanel("cart")}
          >
            <ShoppingBag size={21} />
            <i>{count}</i>
          </button>
          <button
            aria-label="Toggle menu"
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {searchOpen && (
        <form
          className="search-bar wrap"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Search size={20} />
          <input
            placeholder="Search pet toys, pool care & more…"
            aria-label="Search products"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCategory("All");
              setCollection("Shop All");
            }}
          />
          <button className="text-link" type="submit">
            Search <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Close search"
            onClick={() => {
              setSearchOpen(false);
              setQuery("");
            }}
          >
            <X size={19} />
          </button>
        </form>
      )}
      <main>
        <section className="hero pet-pool-hero">
          <div className="hero-inner wrap">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="tiny-line" /> YOUR BACKYARD, BETTER
              </div>
              <h1>
                Happy pets.
                <br />
                Sparkling <span>pools.</span>
              </h1>
              <p>
                Everyday pet essentials. Everything for your pool.
                <br />
                And a helping hand to keep it swim-ready.
              </p>
              <div className="hero-buttons">
                <button className="primary" onClick={() => browse("All", "Shop All")}>
                  Shop pet & pool <ArrowRight size={17} />
                </button>
                <button className="secondary" onClick={goServices}>
                  Pool cleaning <Waves size={17} />
                </button>
              </div>
              <div className="hero-specialists">
                <span>
                  <PawPrint size={17} /> Care for your companions
                </span>
                <span>
                  <Waves size={18} /> Care for your backyard
                </span>
              </div>
            </div>
            <div className="hero-art">
              <div className="aqua-shape" />
              <img
                className="pet-hero-photo"
                src="/images/pet-pool-hero.jpg"
                alt="Golden retriever relaxing beside a swimming pool"
              />
              <button className="pet-float-product" onClick={() => setDetail(products[0])}>
                <img src="/images/rope.png" alt="Colorful rope dog toy" />
                <div>
                  <span>PLAYTIME FAVORITE</span>
                  <strong>Everyday Rope Tug</strong>
                  <b>
                    {money(products[0].price)} <ArrowUpRight size={13} />
                  </b>
                </div>
              </button>
              <button
                className="pet-float-service"
                onClick={() => openQuote("Not sure — help me choose")}
              >
                <span className="service-float-icon">
                  <Waves size={23} />
                </span>
                <span>
                  <strong>A clearer pool starts here.</strong>
                  <small>
                    Explore pool-cleaning care <ArrowRight size={12} />
                  </small>
                </span>
              </button>
              <div className="pet-image-caption">
                <PawPrint size={14} /> MORE TAIL WAGS. MORE GOOD DAYS.
              </div>
            </div>
          </div>
          <div className="hero-bottom wrap">
            <span>PET SUPPLIES · POOL PRODUCTS · POOL CLEANING</span>
            <span>THE PAWS & POOLS WAY</span>
          </div>
        </section>
        <section className="benefits wrap" aria-label="Shopping benefits">
          {[
            { icon: Truck, title: "Free shipping", text: "On orders over $50" },
            { icon: PawPrint, title: "Pet & pool specialists", text: "Essentials for both" },
            { icon: RotateCcw, title: "Easy returns", text: "30-day, hassle-free returns" },
            { icon: Waves, title: "Pool-cleaning care", text: "One-off or regular visits" },
          ].map((b) => (
            <div className="benefit" key={b.title}>
              <b.icon size={27} strokeWidth={1.4} />
              <div>
                <strong>{b.title}</strong>
                <span>{b.text}</span>
              </div>
            </div>
          ))}
        </section>
        <section className="categories-section wrap" id="categories">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ALL THE CARE THEY NEED</div>
              <h2>Shop by category</h2>
            </div>
            <button className="text-link" onClick={() => browse("All", "Shop All")}>
              Explore all categories <ArrowRight size={16} />
            </button>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <button
                key={c.name}
                className={`category-card ${category === c.name ? "chosen" : ""}`}
                onClick={() => (c.service ? goServices() : browse(c.name))}
              >
                <div className={`category-photo category-${c.name.split(" ")[0].toLowerCase()}`}>
                  <img src={c.image} alt={c.name} />
                </div>
                <div className="category-caption">
                  <div>
                    <strong>{c.name}</strong>
                    <span>{c.count}</span>
                  </div>
                  <ArrowUpRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="deal wrap">
          <div className="deal-symbol">
            <Zap size={31} strokeWidth={1.7} />
          </div>
          <div className="deal-copy">
            <div className="eyebrow">BACKYARD SAVINGS</div>
            <h2>
              {remaining
                ? "A little care. A little less. Up to 24% off."
                : "This round of deals has ended."}
            </h2>
            <p>
              {remaining
                ? "Save on selected pool-care essentials. Limited-time demo offers."
                : "Explore pet essentials and pool-care favorites."}
            </p>
          </div>
          <div className="countdown">
            <span>ENDS IN</span>
            <div className="clock">
              {clock.map((n, i) => (
                <div className="clock-item" key={i}>
                  {i > 0 && <b className="colon">:</b>}
                  <strong>{String(n).padStart(2, "0")}</strong>
                  <small>{["HOURS", "MINS", "SECS"][i]}</small>
                </div>
              ))}
            </div>
          </div>
          <button
            className="dark-button"
            onClick={() => browse("All", remaining ? "Flash Deals" : "Shop All")}
          >
            {remaining ? "Shop deals" : "Shop all"} <ArrowRight size={16} />
          </button>
        </section>
        <section className="products-section wrap" id="products">
          <div className="section-heading">
            <div>
              <div className="eyebrow">FAVORITES FOR PAWS & POOLS</div>
              <h2>{displayTitle}</h2>
              <p>
                {category === "All" && !query
                  ? "Little upgrades for playtime, bath time, and pool time."
                  : `${filtered.length} pet & pool essentials to explore.`}
              </p>
            </div>
            <div className="product-heading-actions">
              <button className="text-link" onClick={() => browse("All", "Shop All")}>
                View all products <ArrowRight size={16} />
              </button>
            </div>
          </div>
          {(category !== "All" || query || collection !== "Best Sellers") && (
            <div className="filter-bar">
              <button
                className={category === "All" ? "filter active-filter" : "filter"}
                onClick={() => setCategory("All")}
              >
                All
              </button>
              {categories
                .filter((c) => !c.service)
                .map((c) => (
                  <button
                    key={c.name}
                    className={category === c.name ? "filter active-filter" : "filter"}
                    onClick={() => setCategory(c.name)}
                  >
                    {c.name}
                  </button>
                ))}
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {["Featured", "Price: low to high", "Price: high to low", "Top rated"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          <div className="product-grid">
            {filtered.map((p, i) => (
              <article
                className="product-card"
                key={p.id}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className="product-image">
                  <span
                    className={`badge ${p.badge === "Best seller" ? "bestseller" : p.badge === "New" ? "new-badge" : "sale-badge"}`}
                  >
                    {p.badge}
                  </span>
                  <button
                    aria-label={`${favorites.includes(p.id) ? "Remove" : "Save"} ${p.name} ${favorites.includes(p.id) ? "from" : "to"} wishlist`}
                    className={`favorite-button ${favorites.includes(p.id) ? "is-favorite" : ""}`}
                    onClick={() => favorite(p.id)}
                  >
                    <Heart size={17} fill={favorites.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="product-photo-button"
                    onClick={() => setDetail(p)}
                    aria-label={`View ${p.name}`}
                  >
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </button>
                  <button className="quick-view" onClick={() => setDetail(p)}>
                    Take a closer look <ArrowUpRight size={13} />
                  </button>
                </div>
                <div className="product-meta">
                  <span className="product-category">{p.category}</span>
                  <button className="product-name" onClick={() => setDetail(p)}>
                    {p.name}
                  </button>
                  <div className="price-add">
                    <div>
                      <strong>{money(p.price)}</strong>
                      {p.original && <del>{money(p.original)}</del>}
                      <div className="rating">
                        <span>★★★★★</span>
                        <small>
                          {p.rating} <span>({p.reviews})</span>
                        </small>
                      </div>
                    </div>
                    <button
                      className="add-button"
                      aria-label={`Add ${p.name} to cart`}
                      onClick={() => add(p)}
                    >
                      <Plus size={19} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-results">
              <Search size={30} />
              <h3>No finds just yet</h3>
              <p>Try another search or explore all our favorites.</p>
              <button className="primary" onClick={() => browse("All", "Shop All")}>
                Browse all products <ArrowRight size={16} />
              </button>
            </div>
          )}
        </section>
        <PoolServices onQuote={openQuote} />
        <section className="newsletter wrap">
          <div>
            <div className="eyebrow">A LITTLE BACKYARD KNOW-HOW</div>
            <h2>More tail wags. Fewer pool chores.</h2>
            <p>Pet-care tips, pool-care reminders, and fresh favorites in your inbox.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem("paws-pools-newsletter", JSON.stringify(email));
              setSubscribed(true);
            }}
          >
            {subscribed ? (
              <div className="subscribe-success">
                <Check size={21} />
                <span>
                  Thanks! Your interest is saved on this device.
                  <small>This demo does not send emails.</small>
                </span>
              </div>
            ) : (
              <>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  aria-label="Email address"
                  id="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button aria-label="Save newsletter interest" type="submit">
                  <ArrowRight size={21} />
                </button>
                <small>Just the good stuff. No spam, ever.</small>
              </>
            )}
          </form>
        </section>
      </main>
      <footer className="footer wrap">
        <div>
          <button className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <PawPrint size={25} strokeWidth={2} /> Paws <span>&</span> Pools
          </button>
          <p>Happy pets. Clear pools. Less hassle.</p>
        </div>
        <div className="footer-links">
          <button onClick={() => setInfo(true)}>Our story</button>
          <button onClick={() => browse("All", "Shop All")}>Shop all</button>
          <button onClick={goServices}>Pool-cleaning services</button>
        </div>
        <span>© {new Date().getFullYear()} Paws & Pools. A storefront demo.</span>
      </footer>
      {toast && (
        <output className="toast">
          <span className="toast-check">
            <Check size={16} />
          </span>
          <span>{toast}</span>
          <button
            onClick={() => {
              setPanel("cart");
              setToast("");
            }}
          >
            View bag <ArrowRight size={14} />
          </button>
        </output>
      )}
      {(panel || detail || info || quote) && (
        <div className="modal-backdrop">
          <button
            className="backdrop-dismiss"
            aria-label="Dismiss dialog"
            tabIndex={-1}
            onClick={close}
          />
          <dialog
            open
            ref={modalRef}
            className={panel ? "drawer" : "modal"}
            aria-modal="true"
            aria-label={
              panel === "cart"
                ? "Your shopping bag"
                : panel === "wishlist"
                  ? "Your wishlist"
                  : quote
                    ? "Request a pool-cleaning quote"
                    : detail?.name || "About Paws & Pools"
            }
          >
            <div className="modal-heading">
              <h2>
                {panel === "cart"
                  ? `Your bag (${count})`
                  : panel === "wishlist"
                    ? `Your wishlist (${favorites.length})`
                    : quote
                      ? "Request a pool-cleaning quote"
                      : info
                        ? "A little care goes a long way."
                        : "A closer look"}
              </h2>
              <button className="icon-button" aria-label="Close dialog" onClick={close}>
                <X size={22} />
              </button>
            </div>
            {panel === "cart" && (
              <>
                {count ? (
                  <>
                    <div className="shipping-progress">
                      <Truck size={18} />
                      <span>
                        {total >= 50
                          ? "Your order qualifies for free shipping!"
                          : `You’re ${money(50 - total)} away from free shipping.`}
                      </span>
                      <div>
                        <i style={{ width: `${Math.min(100, (total / 50) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="drawer-items">
                      {products
                        .filter((p) => cart[p.id])
                        .map((p) => (
                          <div className="cart-item" key={p.id}>
                            <img src={p.image} alt={p.name} />
                            <div>
                              <span className="product-category">{p.category}</span>
                              <h3>{p.name}</h3>
                              <strong>{money(p.price)}</strong>
                              <div className="quantity">
                                <button
                                  aria-label={`Decrease ${p.name} quantity`}
                                  onClick={() => change(p.id, -1)}
                                >
                                  <Minus size={13} />
                                </button>
                                <span>{cart[p.id]}</span>
                                <button
                                  aria-label={`Increase ${p.name} quantity`}
                                  onClick={() => change(p.id, 1)}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                            <button
                              className="remove-item"
                              aria-label={`Remove ${p.name} from cart`}
                              onClick={() =>
                                setCart((prev) => {
                                  const next = { ...prev };
                                  delete next[p.id];
                                  return next;
                                })
                              }
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                      <div>
                        <span>Subtotal</span>
                        <strong>{money(total)}</strong>
                      </div>
                      <p>Shipping and taxes calculated at checkout.</p>
                      <button
                        className="primary"
                        onClick={() =>
                          setToast("This is a demo storefront. No payment will be taken.")
                        }
                      >
                        Continue to checkout <ArrowRight size={17} />
                      </button>
                      <span className="demo-note">
                        <ShieldCheck size={14} /> Demo only · No payment will be taken
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <h3>Your next great find awaits.</h3>
                    <p>Your bag is empty. Let’s find something you’ll love.</p>
                    <button
                      className="primary"
                      onClick={() => {
                        close();
                        browse("All", "Shop All");
                      }}
                    >
                      Explore the collection <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
            {panel === "wishlist" && (
              <>
                {favorites.length ? (
                  <div className="drawer-items">
                    {products
                      .filter((p) => favorites.includes(p.id))
                      .map((p) => (
                        <div className="cart-item" key={p.id}>
                          <img src={p.image} alt={p.name} />
                          <div>
                            <h3>{p.name}</h3>
                            <strong>{money(p.price)}</strong>
                            <button className="text-link" onClick={() => add(p)}>
                              Add to bag <Plus size={15} />
                            </button>
                          </div>
                          <button
                            className="remove-item"
                            aria-label={`Remove ${p.name} from wishlist`}
                            onClick={() => favorite(p.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Heart size={48} strokeWidth={1} />
                    <h3>Keep your favorites close.</h3>
                    <p>Tap the heart on any product to save it here.</p>
                    <button className="primary" onClick={close}>
                      Keep exploring <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
            {detail && (
              <div className="detail-content">
                <div className="detail-image">
                  <img src={detail.image} alt={detail.name} />
                </div>
                <div>
                  <span className="eyebrow">{detail.category}</span>
                  <h2>{detail.name}</h2>
                  <div className="rating">
                    <Star size={16} fill="#eab455" color="#eab455" />
                    <small>
                      {detail.rating} · {detail.reviews} reviews
                    </small>
                  </div>
                  <div className="detail-price">
                    <strong>{money(detail.price)}</strong>
                    {detail.original && <del>{money(detail.original)}</del>}
                  </div>
                  <p>{detail.description}</p>
                  <div className="detail-perks">
                    <span>
                      <Truck size={17} /> Free shipping over $50
                    </span>
                    <span>
                      <RotateCcw size={17} /> 30-day easy returns
                    </span>
                  </div>
                  <button className="primary" onClick={() => add(detail)}>
                    Add to bag <ShoppingBag size={17} />
                  </button>
                  <button className="detail-save" onClick={() => favorite(detail.id)}>
                    <Heart
                      size={16}
                      fill={favorites.includes(detail.id) ? "currentColor" : "none"}
                    />
                    {favorites.includes(detail.id) ? "Saved to your wishlist" : "Save for later"}
                  </button>
                  <small className="demo-note">
                    Demo product · Illustrative pricing and details
                  </small>
                </div>
              </div>
            )}
            {quote && <QuoteForm key={quote} initialService={quote} onDone={close} />}
            {info && (
              <div className="about-content">
                <span className="eyebrow">WELCOME TO PAWS & POOLS</span>
                <p>
                  Life is better with a happy pet and a pool ready for the weekend. Paws & Pools
                  brings together pet essentials, pool-care products, and pool-cleaning services—so
                  you can spend less time on the to-do list and more time enjoying your backyard.
                </p>
                <h3>A little peace of mind</h3>
                <div className="detail-perks">
                  <span>
                    <Truck size={19} /> Free shipping on orders over $50
                  </span>
                  <span>
                    <RotateCcw size={19} /> Easy returns within 30 days
                  </span>
                  <span>
                    <ShieldCheck size={19} /> Pet supplies, pool products & cleaning care
                  </span>
                </div>
                <p className="info-demo">
                  This is an interactive storefront demo. Products, reviews, pricing, and policies
                  are illustrative. Your cart and wishlist are saved locally; orders and payments
                  are not processed. Service enquiries are demo previews only; no request is sent or
                  appointment confirmed.
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    close();
                    browse("All", "Shop All");
                  }}
                >
                  Find your backyard favorites <ArrowRight size={16} />
                </button>
              </div>
            )}
          </dialog>
        </div>
      )}
    </div>
  );
}
