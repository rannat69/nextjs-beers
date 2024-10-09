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
  const itemsPerPage = 5; 

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

  const handleErrorImage = (beerId: number) => (e: any) => {
    setImageErrors((prev) => ({ ...prev, [beerId]: true }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
    setCurrentPage(1);
  };

  let filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBeers.length / itemsPerPage);
  filteredBeers = filteredBeers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="text"
        name="name"
        id="searchName"
        placeholder="Search by name..."
        value={searchName}
        onChange={handleSearchChange}
      />

      <ol>
        {filteredBeers.map((beer) => (
          <div key={beer.id}>
            <li>{beer.name}</li>
            <Image
              src={imageErrors[beer.id] ? noImageFound : beer.image}
              alt={beer.name}
              width={100}
              height={100}
              onError={handleErrorImage(beer.id)}
            />
          </div>
        ))}
      </ol>

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
  );
}
