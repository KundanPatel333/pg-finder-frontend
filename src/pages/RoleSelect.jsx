import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">PG Finder</h1>
        <p className="text-sm text-gray-500 mb-8">Near Christ University, Bangalore</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login?role=student")}
            className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gray-400 transition"
          >
            <h2 className="font-medium text-gray-800 mb-1">I'm a Student</h2>
            <p className="text-sm text-gray-500">Find a PG near your college</p>
          </button>

          <button
            onClick={() => navigate("/login?role=owner")}
            className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gray-400 transition"
          >
            <h2 className="font-medium text-gray-800 mb-1">I'm a PG Owner</h2>
            <p className="text-sm text-gray-500">List your PG and get students</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;