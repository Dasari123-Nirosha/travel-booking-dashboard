import { useEffect, useState } from "react";
import { Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import destinationsData from "../../data/destinations";
import { formatCurrency } from "../../utils/formatters";

const STORAGE_KEY = "travel-destinations";

function PopularDestinations() {
  const navigate = useNavigate();

  const [destinations, setDestinations] =
    useState(destinationsData);

  useEffect(() => {
    const loadDestinations = () => {
      try {
        const savedDestinations =
          localStorage.getItem(STORAGE_KEY);

        if (!savedDestinations) {
          setDestinations(destinationsData);
          return;
        }

        const parsedDestinations =
          JSON.parse(savedDestinations);

        if (!Array.isArray(parsedDestinations)) {
          setDestinations(destinationsData);
          return;
        }

        /*
          Merge saved destination data with
          the original destination data.
        */
        const mergedDestinations =
          parsedDestinations.map(
            (savedDestination) => {
              const defaultDestination =
                destinationsData.find(
                  (item) =>
                    item.id ===
                      savedDestination.id ||
                    item.name?.toLowerCase() ===
                      savedDestination.name?.toLowerCase()
                );

              return {
                ...defaultDestination,
                ...savedDestination,
              };
            }
          );

        /*
          Add any default destinations that are
          missing from localStorage.
        */
        const savedIds = new Set(
          mergedDestinations.map(
            (item) => item.id
          )
        );

        const missingDestinations =
          destinationsData.filter(
            (item) =>
              !savedIds.has(item.id)
          );

        setDestinations([
          ...mergedDestinations,
          ...missingDestinations,
        ]);
      } catch (error) {
        console.error(
          "Unable to load destinations:",
          error
        );

        setDestinations(destinationsData);
      }
    };

    loadDestinations();

    /*
      Update dashboard when the Destinations
      page changes a destination.
    */
    window.addEventListener(
      "travel-destinations-updated",
      loadDestinations
    );

    window.addEventListener(
      "storage",
      loadDestinations
    );

    return () => {
      window.removeEventListener(
        "travel-destinations-updated",
        loadDestinations
      );

      window.removeEventListener(
        "storage",
        loadDestinations
      );
    };
  }, []);

  const popularDestinations = [
    ...destinations,
  ]
    .sort(
      (a, b) =>
        Number(b.bookings || 0) -
        Number(a.bookings || 0)
    )
    .slice(0, 5);

  return (
    <div className="popular-card">
      <div className="popular-card-header">
        <div>
          <h3>Popular Destinations</h3>
          <p>
            Top destinations by bookings
          </p>
        </div>

        <button
          className="view-all-button"
          type="button"
          onClick={() =>
            navigate("/destinations")
          }
        >
          View All
        </button>
      </div>

      <div className="destination-list">
        {popularDestinations.map(
          (destination, index) => {
            const image =
              destination.image ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                className="destination-item"
                key={destination.id}
              >
                <div className="destination-rank">
                  {index + 1}
                </div>

                <div className="destination-image">
                  <img
                    src={image}
                    alt={
                      destination.name ||
                      "Destination"
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>

                <div className="destination-info">
                  <h4>
                    {destination.name}
                  </h4>

                  <span>
                    {destination.country}
                  </span>
                </div>

                <div className="destination-rating">
                  <Star size={14} />
                  <span>
                    {destination.rating || "-"}
                  </span>
                </div>

                <div className="destination-bookings">
                  <strong>
                    {destination.bookings || 0}
                  </strong>

                  <span>
                    bookings
                  </span>
                </div>

                <div className="destination-price">
                  <strong>
                    {formatCurrency(
                      Number(
                        destination.price ??
                          destination.amount ??
                          0
                      )
                    )}
                  </strong>

                  <span>
                    per trip
                  </span>
                </div>

                <button
                  className="destination-arrow"
                  type="button"
                  onClick={() =>
                    navigate(
                      "/destinations"
                    )
                  }
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default PopularDestinations;