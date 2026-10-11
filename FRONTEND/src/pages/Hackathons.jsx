import { useEffect, useState } from "react";
import api from "../api";
import HackathonCard from "../components/HackathonCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";

function Hackathons() {
    const [hackathons, setHackathons] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [mode, setMode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHackathons = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await api.get("/hackathons", {
                    params: { search, status, mode }
                });
                setHackathons(res.data.hackathons);
            } catch (err) {
                setError(err.response?.data?.message || "Could not load hackathons");
            } finally {
                setLoading(false);
            }
        };

        loadHackathons();
    }, [search, status, mode]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Hackathons</h1>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <SearchBar onSearch={setSearch} />
                <FilterBar
                    status={status}
                    mode={mode}
                    onStatusChange={setStatus}
                    onModeChange={setMode}
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : hackathons.length === 0 ? (
                search || status || mode ? (
                    <EmptyState
                        title="No matching hackathons"
                        message="Try a different search term or change the filters."
                    />
                ) : (
                    <EmptyState
                        title="No hackathons yet"
                        message="Be the first to add a hackathon for everyone to see."
                        actionLabel="Add hackathon"
                        actionTo="/hackathons/create"
                    />
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hackathons.map((hackathon) => (
                        <HackathonCard key={hackathon._id} hackathon={hackathon} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Hackathons;