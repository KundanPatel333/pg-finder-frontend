import { Link } from "react-router-dom";

const PGCard = ({ pg, linkTo }) => {
  const card = (
    <div>
      <div className="relative overflow-hidden bg-line/30 aspect-[4/3]">
        {pg.images?.[0] ? (
          <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
            No photo yet
          </div>
        )}
        <span className="absolute top-3 left-3 bg-paper text-ink text-xs font-medium px-2 py-1">
          ₹{pg.priceRange?.min} – ₹{pg.priceRange?.max}
        </span>
      </div>
      <div className="pt-3">
        <p className="font-display text-lg text-ink leading-snug">{pg.name}</p>
        <p className="text-sm text-ink/60">{pg.address}</p>
        <p className="text-xs text-ink/40 mt-1">{pg.interestedCount || 0} students interested</p>
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{card}</Link> : card;
};

export default PGCard;