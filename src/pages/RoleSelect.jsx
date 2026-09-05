import { useNavigate } from "react-router-dom";

const options = [
  {
    role: "student",
    title: "I'm looking for a PG",
    body: "Browse rooms near Christ University, schedule a visit, and confirm on the spot.",
  },
  {
    role: "owner",
    title: "I have a PG to list",
    body: "Put your rooms in front of students who are actively looking.",
  },
];

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="bg-primary px-6 py-16 text-center">
        <p className="font-display text-4xl text-paper mb-2">PG Finder</p>
        <p className="text-sm text-paper/70">Near Christ University, Bangalore</p>
      </div>

      <div className="flex-1 px-6 py-10">
        <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
          {options.map((opt) => (
            <button
              key={opt.role}
              onClick={() => navigate(`/login?role=${opt.role}`)}
              className="w-full text-left bg-white border-2 border-line hover:border-primary rounded-lg p-5 transition-colors"
            >
              <p className="font-display text-xl text-ink mb-1">{opt.title}</p>
              <p className="text-sm text-ink/60">{opt.body}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;