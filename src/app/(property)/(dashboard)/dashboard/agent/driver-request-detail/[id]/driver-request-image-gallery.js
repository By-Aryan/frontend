"use client";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { useState } from "react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PropertyGallery = ({ property }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const getPropertyImageUrl = (listing, index = 0) => {
    if (listing.processedImages && listing.processedImages[index]) {
      return listing.processedImages[index];
    }
    if (listing.developer_notes?.images?.[index]?.full_url) {
      return listing.developer_notes.images[index].full_url;
    }
    return "/images/home/property-image.jpeg";
  };

  const getPropertyVideoUrl = (listing, index = 0) => {
    return listing.developer_notes?.videos?.[index]?.full_url ?? null;
  };

  const getMediaItems = () => {
    const mediaItems = [];

    property?.developer_notes?.images?.forEach((img, index) => {
      mediaItems.push({
        type: "image",
        url: getPropertyImageUrl(property, index),
        thumbnail: getPropertyImageUrl(property, index),
        alt: `Property image ${index + 1}`,
        index,
      });
    });

    property?.developer_notes?.videos?.forEach((video, index) => {
      const videoUrl = getPropertyVideoUrl(property, index);
      if (videoUrl) {
        mediaItems.push({
          type: "video",
          url: videoUrl,
          thumbnail: "/images/video-thumbnail.jpg",
          alt: `Property video ${index + 1}`,
          index,
        });
      }
    });

    if (mediaItems.length === 0) {
      mediaItems.push({
        type: "image",
        url: "/images/home/property-image.jpeg",
        thumbnail: "/images/home/property-image.jpeg",
        alt: "Default property image",
        index: 0,
      });
    }

    return mediaItems;
  };

  const mediaItems = getMediaItems();
  const currentMediaItem = mediaItems[selectedMediaIndex];

  const openVideoModal = (url) => {
    setSelectedVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl("");
  };

  if (!mediaItems.length) return null;

  return (
    <div className="overflow-hidden">
      <Gallery>
        <div className="flex flex-col items-center gap-6">
          {/* Main Media Display */}
          <div className="w-full max-w-6xl">
            {currentMediaItem.type === "image" ? (
              <Item
                original={currentMediaItem.url}
                thumbnail={currentMediaItem.thumbnail}
                width={1200}
                height={800}
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="relative w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                  >
                    <Image
                      src={currentMediaItem.url}
                      alt={currentMediaItem.alt}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}
              </Item>
            ) : (
              <div
                className="relative w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer bg-black flex items-center justify-center hover:opacity-90 transition"
                onClick={() => openVideoModal(currentMediaItem.url)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">Play Video</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Carousel */}
          <div className="w-full max-w-6xl px-2">
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={4}
              navigation
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
            >
              {mediaItems.map((mediaItem, index) => (
                <SwiperSlide key={`${mediaItem.type}-${index}`}>
                  <div
                    className={`relative aspect-[4/3] w-full rounded-md overflow-hidden cursor-pointer border-2 ${
                      index === selectedMediaIndex
                        ? "border-green-600 shadow-md"
                        : "border-transparent"
                    } transition-all duration-200`}
                    onClick={() => setSelectedMediaIndex(index)}
                  >
                    {mediaItem.type === "image" ? (
                      <Image
                        src={mediaItem.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                          VIDEO
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Gallery>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full mx-4 relative">
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <video
              src={selectedVideoUrl}
              controls
              autoPlay
              className="w-full rounded-md"
              style={{ maxHeight: "80vh" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;