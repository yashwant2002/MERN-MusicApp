import React, { useRef, useState } from "react";
import HomeSongCard from "./HomeSongCard";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const HomeCardRow = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const responsive = {
    0: { items: 2 },
    720: { items: 4 },
    1024: { items: 6 },
  };

  const totalItems = 11;
  const items = Array(totalItems).fill(null).map((_, index) => <HomeSongCard key={index} />);

  // Manual navigation handlers
  const slidePrev = () => {
    if (activeIndex > 0) {
      carouselRef.current?.slidePrev();
    }
  };

  const slideNext = () => {
    if (activeIndex < totalItems - 1) {
      carouselRef.current?.slideNext();
    }
  };

  // Update active index on slide change
  const handleSlideChange = (e) => {
    setActiveIndex(e.item);
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5  lg:pr-10 flex-nowrap">
        <h2 className="text-2xl font-extrabold text-white">New Release</h2>
        <div className="flex space-x-2 flex-shrink-0 min-w-[90px]">
          <button
            onClick={slidePrev}
            disabled={activeIndex === 0}
            className={`rounded-full border border-white p-2 transition ${
              activeIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={slideNext}
            disabled={activeIndex >= totalItems - 1}
            className={`rounded-full border border-white p-2 transition ${
              activeIndex >= totalItems - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative">
        <AliceCarousel
          ref={carouselRef}
          items={items}
          responsive={responsive}
          disableButtonsControls
          disableDotsControls
          paddingLeft={0}
          paddingRight={0}
          onSlideChanged={handleSlideChange}
        />
      </div>
    </div>
  );
};

export default HomeCardRow;
