import { Link } from "react-router-dom";

const PGCard = ({ pg, linkTo }) => {
  const card = (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
      {pg.images?.[0] && (
        <img
          src={pg.images[0]}
          alt={pg.name}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="font-medium text-gray-800">{pg.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{pg.address}</p>
      <p className="text-sm text-gray-700">
        ₹{pg.priceRange?.min} - ₹{pg.priceRange?.max}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        {pg.interestedCount || 0} students interested
      </p>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{card}</Link> : card;
};

export default PGCard;