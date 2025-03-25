import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Users, ArrowRight, Loader } from "lucide-react"; 
import { Problem } from "../types"; 
import { rooms } from "../lib/api";  

interface CreateRoomProps {   
  problem: Problem;   
  onClose: () => void; 
}  

export function CreateRoom({ problem, onClose }: CreateRoomProps) {   
  const navigate = useNavigate();   
  const [maxParticipants, setMaxParticipants] = useState(4);   
  const [loading, setLoading] = useState(false);   
  const [error, setError] = useState<string | null>(null);    

  const createRoom = async () => {     
    setLoading(true);     
    setError(null);      
    
    try {       
      // Validate problem ID
      if (!problem._id) {
        throw new Error("Invalid problem selected");
      }
      
      const response = await rooms.create(problem._id, maxParticipants);       
      console.log("Room created:", response);

      // Validate the response
      if (!response || !response.data || !response.data._id) {
        throw new Error("Invalid response from server");
      }
      
      // // Navigate to the room
      navigate(`/room/${response.data._id}`);
    } catch (err: any) {       
      console.error("Error creating room:", err);
      setError(err.message || "Failed to create room. Please try again.");
    } finally {       
      setLoading(false);     
    }   
  };    

  return (     
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">       
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">         
        <div className="p-6 border-b dark:border-gray-700">           
          <div className="flex items-center justify-between mb-4">             
            <h2 className="text-xl font-bold">Create Collaborative Room</h2>             
            <button
              onClick={onClose}               
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"             
            >               
              ×             
            </button>           
          </div>         
        </div>          
        
        <div className="p-6">           
          <div className="mb-6">             
            <h3 className="font-medium mb-2">Problem</h3>             
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">               
              <p className="font-medium">{problem.title}</p>               
              <p className="text-sm text-gray-500 mt-1">                 
                Difficulty: {problem.difficulty}               
              </p>             
            </div>           
          </div>            
          
          <div className="mb-6">             
            <label className="block font-medium mb-2">               
              Maximum Participants             
            </label>             
            <div className="flex items-center space-x-4">               
              <Users className="w-5 h-5 text-gray-500" />               
              <input                 
                type="range"                 
                min="1"                 
                max="4"                 
                value={maxParticipants}                 
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}                 
                className="flex-1"               
              />               
              <span className="font-medium">{maxParticipants}</span>             
            </div>           
          </div>            
          
          {error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}            
          
          <button             
            onClick={createRoom}             
            disabled={loading}             
            className={`w-full flex items-center justify-center space-x-2 ${               
              loading                 
                ? "bg-gray-400 cursor-not-allowed"                 
                : "bg-blue-500 hover:bg-blue-600 text-white"             
            } py-2 px-4 rounded-lg transition-colors`}           
          >             
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create Room</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>         
        </div>       
      </div>     
    </div>   
  ); 
}