import React, { useEffect, useState } from "react";

const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    minNetIncome: "",
    maxNetIncome: "",
  });

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: "asc", // 'asc' or 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${process.env.REACT_APP_API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Initially display all data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = data;

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter((item) => new Date(item.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter((item) => new Date(item.date) <= new Date(filters.endDate));
    }

    // Filter by revenue range
    if (filters.minRevenue) {
      filtered = filtered.filter((item) => item.revenue >= Number(filters.minRevenue));
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter((item) => item.revenue <= Number(filters.maxRevenue));
    }

    // Filter by net income range
    if (filters.minNetIncome) {
      filtered = filtered.filter((item) => item.netIncome >= Number(filters.minNetIncome));
    }
    if (filters.maxNetIncome) {
      filtered = filtered.filter((item) => item.netIncome <= Number(filters.maxNetIncome));
    }

    setFilteredData(filtered);
  };

  // Handle sorting
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ column, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Financial Data</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Filter inputs */}
      <div className="mb-4 space-y-4">
        <div>
          <label className="block font-semibold">Date Range:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Revenue Range:</label>
          <input
            type="number"
            name="minRevenue"
            placeholder="Min Revenue"
            value={filters.minRevenue}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="maxRevenue"
            placeholder="Max Revenue"
            value={filters.maxRevenue}
            onChange={handleFilterChange}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Net Income Range:</label>
          <input
            type="number"
            name="minNetIncome"
            placeholder="Min Net Income"
            value={filters.minNetIncome}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="maxNetIncome"
            placeholder="Max Net Income"
            value={filters.maxNetIncome}
            onChange={handleFilterChange}
            className="border p-2"
          />
        </div>
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-200 w-full">
          <thead>
            <tr>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date {sortConfig.column === "date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("revenue")}
              >
                Revenue {sortConfig.column === "revenue" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("netIncome")}
              >
                Net Income {sortConfig.column === "netIncome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="border p-2">Gross Profit</th>
              <th className="border p-2">EPS</th>
              <th className="border p-2">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.revenue}</td>
                <td className="border p-2">{item.netIncome}</td>
                <td className="border p-2">{item.grossProfit}</td>
                <td className="border p-2">{item.eps}</td>
                <td className="border p-2">{item.operatingIncome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialTable;
