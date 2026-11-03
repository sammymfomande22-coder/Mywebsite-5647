import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Droplets,
  CalendarDays,
  Sparkles,
  Waves,
} from "lucide-react";
const services = [
  {
    name: "One-off clean",
    icon: Sparkles,
    tag: "A fresh start",
    description: "A thorough refresh when your pool needs a little extra attention.",
    includes: [
      "Surface skim & debris removal",
      "Wall brushing & vacuuming",
      "Water check & care recommendations",
    ],
  },
  {
    name: "Regular maintenance",
    icon: CalendarDays,
    tag: "Less on your to-do list",
    description: "Keep your pool-care routine on track with recurring visits.",
    includes: [
      "Weekly or fortnightly preferences",
      "Routine cleaning & water checks",
      "Filter check & maintenance guidance",
    ],
  },
  {
    name: "Green pool recovery",
    icon: Droplets,
    tag: "Bring back the blue",
    description: "An assessment-led approach for cloudy or neglected pools.",
    includes: [
      "Pool condition assessment",
      "Tailored treatment recommendations",
      "Follow-up care plan",
    ],
  },
];
export function PoolServices({ onQuote }: { onQuote: (service: string) => void }) {
  return (
    <section className="pool-services wrap" id="services">
      <div className="service-feature">
        <div className="service-photo">
          <img
            src="/images/pool-service.jpg"
            alt="Pool technician cleaning a swimming pool"
            loading="lazy"
          />
          <span>
            <Waves size={18} /> A LITTLE HELP GOES A LONG WAY
          </span>
        </div>
        <div className="service-feature-copy">
          <div className="eyebrow">POOL CLEANING, WITHOUT THE HASSLE</div>
          <h2>
            Less pool work.
            <br />
            More pool time.
          </h2>
          <p>
            From a one-off refresh to regular maintenance, find the right care for your pool—and get
            back to enjoying your backyard.
          </p>
          <div className="service-benefits">
            <span>
              <Check size={15} /> Cleaning & water checks
            </span>
            <span>
              <Check size={15} /> Care that fits your pool
            </span>
          </div>
          <button className="primary" onClick={() => onQuote("Not sure — help me choose")}>
            Request a pool-cleaning quote <ArrowRight size={17} />
          </button>
          <small>
            Share your postcode to check the service area.
            <br />
            Demo enquiry only · Availability is not confirmed.
          </small>
        </div>
      </div>
      <div className="service-options">
        {services.map((s) => (
          <article className="service-option" key={s.name}>
            <div className="service-option-top">
              <s.icon size={22} />
              <span>{s.tag}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <ul>
              {s.includes.map((item) => (
                <li key={item}>
                  <Check size={13} />
                  {item}
                </li>
              ))}
            </ul>
            <button className="text-link" onClick={() => onQuote(s.name)}>
              Enquire about this service <ArrowUpIcon />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
function ArrowUpIcon() {
  return <ArrowRight size={16} />;
}
export function QuoteForm({
  initialService,
  onDone,
}: {
  initialService: string;
  onDone: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState(initialService);
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [date, setDate] = useState("");
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (submitted)
    return (
      <div className="quote-success">
        <CheckCircle2 size={45} strokeWidth={1.5} />
        <div className="eyebrow">DEMO ENQUIRY COMPLETE</div>
        <h3>Thanks, {name.split(" ")[0]}.</h3>
        <p>
          Here’s a preview of your pool-care request.{" "}
          <strong>Nothing has been sent, and no booking is confirmed.</strong>
        </p>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{service}</dd>
          </div>
          <div>
            <dt>Postcode</dt>
            <dd>{postcode}</dd>
          </div>
          {date && (
            <div>
              <dt>Preferred date</dt>
              <dd>{date}</dd>
            </div>
          )}
        </dl>
        <p className="quote-note">
          A live store would check your service area, discuss your pool, and confirm pricing and
          availability before arranging a visit.
        </p>
        <button className="primary" onClick={onDone}>
          Back to the store <ArrowRight size={16} />
        </button>
      </div>
    );
  return (
    <form
      className="quote-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <p>
        Tell us a little about your pool. Service availability and pricing would be confirmed after
        assessment.
      </p>
      <div className="quote-demo">
        <Waves size={17} />
        <span>
          This is a demo form. Your details are not sent or stored, and no appointment is booked.
        </span>
      </div>
      <div className="quote-fields">
        <label>
          Full name
          <input
            aria-label="Full name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Email address
          <input
            aria-label="Quote email address"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Phone number <span>(optional)</span>
          <input
            aria-label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="Best contact number"
          />
        </label>
        <label>
          Service postcode
          <input
            aria-label="Service postcode"
            autoComplete="postal-code"
            required
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Your postcode"
          />
        </label>
        <label>
          Service needed
          <select
            aria-label="Service needed"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {[...services.map((s) => s.name), "Not sure — help me choose"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Preferred date <span>(optional)</span>
          <input
            aria-label="Preferred date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="full-width">
          Pool type
          <select aria-label="Pool type" defaultValue="Not sure">
            <option>Not sure</option>
            <option>In-ground pool</option>
            <option>Above-ground pool</option>
            <option>Spa / hot tub</option>
          </select>
        </label>
        <label className="full-width">
          Anything we should know? <span>(optional)</span>
          <textarea
            aria-label="Pool details"
            rows={3}
            placeholder="Approximate pool size, current condition, or access details…"
          />
        </label>
      </div>
      <button className="primary" type="submit">
        Preview my quote request <ArrowRight size={16} />
      </button>
    </form>
  );
}
