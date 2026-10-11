import { useEffect, useState } from "react";
import api from "../api";
import HackathonCard from "../components/HackathonCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

const emptyFilters = { status: "", mode: "", startFrom: "", startTo: "", sort: "newest" };

function Hackathons() {
    const [hackathons, setHackathons] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(emptyFilters);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHackathons = async () => {
            setLoading(true);
            setError("");

            // only send filters that have a value
            const params = { page, limit: PAGE_SIZE };
            if (search) {
                params.search = search;
            }
            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    params[key] = filters[key];
                }
            });

            try {
                const res = await api.get("/hackathons", { params });
                setHackathons(res.data.hackathons);
                setTotal(res.data.total);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                setError(err.response?.data?.message || "Could not load hackathons");
            } finally {
                setLoading(false);
            }
        };

        loadHackathons();
    }, [search, filters, page]);

    // go back to the first page whenever the search or a filter changes
    const handleSearch = (text) => {
        setSearch(text);
        setPage(1);
    };

    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
        setPage(1);
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        setPage(1);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Hackathons</h1>

            <div className="flex flex-col gap-3 mb-6">
                <SearchBar onSearch={handleSearch} />
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <FilterBar filters={filters} onChange={handleFilterChange} />
                    <button onClick={clearFilters} className="text-indigo-600 text-sm py-2">
                        Clear filters
                    </button>
                </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : hackathons.length === 0 ? (
                <p className="text-gray-600">No hackathons match your search.</p>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-3">
                        {total} {total === 1 ? "hackathon" : "hackathons"} found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hackathons.map((hackathon) => (
                            <HackathonCard key={hackathon._id} hackathon={hackathon} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}

export default Hackathons;
