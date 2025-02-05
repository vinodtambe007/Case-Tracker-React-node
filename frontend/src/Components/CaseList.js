import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState("");

  const navigate=useNavigate()

  const location = useLocation();
  const email = location.state;
  console.log(email);

  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/caselist/");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cases");
      }
      setCases(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleLockUnlock = async (caseId, currentCondition) => {
    try {
      const response = await fetch("http://localhost:5000/api/caselist/lock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condition: currentCondition === "lock" ? "unlock" : "lock",
          email,
          caseId,
        }),
      });

      const data = response.json();

      // if (!response.ok) {
      //     throw new Error(data.error || 'Failed to update case');
      //     console.log('failed')
      // }
      if (!response.ok) {
        if (response.status === 403) {
          alert("This Case Is Lock By someone Else!!");
        } else {
          throw new Error(data.error || "Failed to update case");
        }
      }

      const updatedCase = cases.map((caseItem) => {
        if (caseItem._id === caseId) {
          return {
            ...caseItem,
            condition: data.condition,
            lockedBy: data.email,
          };
        }
        return caseItem;
      });
      setCases(updatedCase);
      fetchCases();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCompleted = async (caseId) => {
    try {
      const response = await fetch("http://localhost:5000/api/caselist/completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          caseId,
        }),
      });
  
      if (!response.ok) {
        if (response.status === 403) {
          alert("This Case Is Locked By someone Else!!");
        } else {
          throw new Error("Failed to update case");
        }
      }
  
      const data = await response.json();
      fetchCases();
  
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="container mx-auto mt-10">
      <button   className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700" onClick={()=>navigate('/')}>Logout</button>
      <div className="flex justify-between mt-1">
      <h2 className="mb-6 text-2xl font-bold text-center p-1 rounded bg-green-400">Case List </h2>
      <h2 className="mb-6 text-2xl font-bold text-center"> User : {email}</h2>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Sr. No</th>
            <th className="px-4 py-2 border">Case Name</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Condition</th>
            <th className="px-4 py-2 border">Actions</th>
            <th className="px-4 py-2 border">Loked By</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem, index) => (
            <tr key={caseItem._id}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{caseItem.case_name}</td>
              <td className="px-4 py-2 border">{caseItem.status}</td>
              <td className="px-4 py-2 border">{caseItem.condition}</td>
              <td className="px-4 py-2 border flex">
                <button
                  className="px-2 py-1 mr-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={() =>
                    handleLockUnlock(caseItem._id, caseItem.condition)
                  }
                >
                  {caseItem.condition === "lock" ? "Unlock" : "Lock"}
                </button>
                <button
                  className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700"
                  onClick={() =>handleCompleted(caseItem._id)
                  }
                >
                  {caseItem.status === "completed"
                    ? "Not Completed"
                    : "Completed"}
                </button>
              </td>
              <td className="px-4 py-2 border">{caseItem.lockedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseList;
