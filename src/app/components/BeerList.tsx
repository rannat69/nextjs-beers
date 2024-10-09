"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import noImageFound from "./../no_image_found.png"; // Adjust the path accordingly

type Beer = {
  id: number;
  name: string;
  price: string;
  rating: {
    average: number;
    reviews: number;
  };
  image: string;
};

export default function BeerList() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16); // Default to 16
  const [totalPages, setTotalPages] = useState(1); // New state for total pages

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await fetch("/api/beers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const beersData = await response.json();
        setBeers(beersData);
      } catch (error) {
        console.error("Failed to fetch beers:", error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchBeers();
  }, []);

  // Adjust items per page based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setItemsPerPage(8); // Set to 12 items for mobile
      } else if (window.innerWidth < 800) {
        setItemsPerPage(12); // Set to 16 items for medium screens
      } else {
        setItemsPerPage(16); // Default: 4 columns, 4 rows
      }
    };

    handleResize(); // Set initial items per page
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  // Calculate total pages whenever beers or itemsPerPage changes
  useEffect(() => {
    const filteredBeers = beers.filter((beer) =>
      beer.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setTotalPages(Math.ceil(filteredBeers.length / itemsPerPage));
  }, [beers, itemsPerPage, searchName]); // Dependencies include beers, itemsPerPage, and searchName

  const handleErrorImage = (beerId: number) => (e: any) => {
    setImageErrors((prev) => ({ ...prev, [beerId]: true }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  function handleBuy(beerName: string) {
    const searchTerm = "buy " + beerName; // Replace with your desired search term
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchTerm
    )}`;
    window.open(googleSearchUrl, "_blank");
  }

  let filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Calculate current beers based on pagination
  filteredBeers = filteredBeers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      {" "}
      {/* Add container class */}
      <div className="content">
        {" "}
        {/* Content wrapper */}
        <input
          type="text"
          name="name"
          id="searchName"
          placeholder="Search by name..."
          value={searchName}
          onChange={handleSearchChange}
        />
        {/* Grid Layout */}
        <div className="beer-grid">
          {filteredBeers.map((beer) => (
            <div key={beer.id} className="beer-item">
              <h3>{beer.name}</h3>
              <Image
                src={imageErrors[beer.id] ? noImageFound : beer.image}
                alt={beer.name}
                width={100}
                height={100}
                onError={handleErrorImage(beer.id)}
              />

              <button onClick={() => handleBuy(beer.name)}>Buy Now</button>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
