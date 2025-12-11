// "use client";
// import { Gallery, Item } from "react-photoswipe-gallery";
// import "photoswipe/dist/photoswipe.css";
// import Image from "next/image";
// import { useState } from "react";

// const PropertyGallery = ({ property }) => {
//   console.log("🚀 ~ PropertyGallery ~ property:~12345678", property)
//   let Images = [
//     "/images/home/property-image.jpeg",
//     "/images/listings/demoBanglow2.jpg",
//   ];

//   const [isOpen, setIsOpen] = useState(false);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const openModal = (url) => {
//     setVideoUrl(url);
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setVideoUrl("");
//   };

//   if (!Images || Images.length === 0) return null;

//   const currentImage = Images[selectedImageIndex];

//   return (
//     <div className="overflow-hidden">
//       <Gallery>
//         <div className="flex flex-col items-center">
//           {/* 🖼 Main Selected Image */}
//           <div className="w-full max-w-2xl mb-4">
//             <Item
//               original={currentImage}
//               thumbnail={currentImage}
//               width={800}
//               height={600}
//             >
//               {({ ref, open }) => (
//                 <div
//                   className="relative h-[500px] w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
//                   ref={ref}
//                   onClick={open}
//                 >
//                   <Image
//                     src={currentImage} // ✅ Now using the correct image
//                     alt={`Main property image ${selectedImageIndex + 1}`}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
//                   />
//                 </div>
//               )}
//             </Item>
//           </div>

//           {/* 🖼 Thumbnail Image Strip */}
//           <div className="flex flex-wrap gap-2 justify-center">
//             {Images.map((img, index) => (
//               <div
//                 key={index}
//                 className={`relative h-24 w-32 rounded-md overflow-hidden cursor-pointer border-2 ${
//                   index === selectedImageIndex
//                     ? "border-green-600"
//                     : "border-transparent"
//                 }`}
//                 onClick={() => setSelectedImageIndex(index)}
//               >
//                 <Image
//                   src={img}
//                   alt={`Thumbnail ${index + 1}`}
//                   fill
//                   className="object-cover"
//                   sizes="100px"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </Gallery>

//       {/* 🎬 Video Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-2 text-gray-700 text-lg font-bold"
//             >
//               ✕
//             </button>
//             <video
//               src={videoUrl}
//               controls
//               autoPlay
//               className="w-full rounded-md h-96"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyGallery;
"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { useState } from "react";

const PropertyGallery = ({ property }) => {
  console.log("🚀 ~ PropertyGallery ~ property:", property);
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Helper function to get property image URL
  const getPropertyImageUrl = (listing, index = 0) => {
    // First try to use processed images (if they exist)
    if (listing.processedImages && listing.processedImages[index]) {
      return listing.processedImages[index];
    }

    // Use the full_url from developer_notes.images
    if (
      listing.developer_notes?.images &&
      listing.developer_notes.images[index] &&
      listing.developer_notes.images[index].full_url
    ) {
      let imageUrl = listing.developer_notes.images[index].full_url;
      // Fix double /uploads/ issue by removing duplicate if present
      imageUrl = imageUrl.replace(/\/uploads\/+uploads\//g, '/uploads/');
      return imageUrl;
    }

    // Final fallback to null (show camera icon)
    return null;
  };

  // Helper function to get property video URL
  const getPropertyVideoUrl = (listing, index = 0) => {
    if (
      listing.developer_notes?.videos &&
      listing.developer_notes.videos[index] &&
      listing.developer_notes.videos[index].full_url
    ) {
      let videoUrl = listing.developer_notes.videos[index].full_url;
      // Fix double /uploads/ issue by removing duplicate if present
      videoUrl = videoUrl.replace(/\/uploads\/+uploads\//g, '/uploads/');
      return videoUrl;
    }
    return null;
  };

  // Combine images and videos into a single media array
  const getMediaItems = () => {
    const mediaItems = [];

    // Add images (filter out null URLs)
    if (property?.developer_notes?.images) {
      property.developer_notes.images.forEach((img, index) => {
        const imageUrl = getPropertyImageUrl(property, index);
        if (imageUrl) { // Only add if URL is valid
          mediaItems.push({
            type: 'image',
            url: imageUrl,
            thumbnail: imageUrl,
            alt: `Property image ${index + 1}`,
            index: index
          });
        }
      });
    }

    // Add videos
    if (property?.developer_notes?.videos) {
      property.developer_notes.videos.forEach((video, index) => {
        const videoUrl = getPropertyVideoUrl(property, index);
        if (videoUrl) {
          mediaItems.push({
            type: 'video',
            url: videoUrl,
            thumbnail: "/images/video-thumbnail.jpg", // You can use a video thumbnail or default
            alt: `Property video ${index + 1}`,
            index: index
          });
        }
      });
    }

    // If no media items, return null to show camera icon
    if (mediaItems.length === 0) {
      mediaItems.push({
        type: 'placeholder',
        url: null,
        thumbnail: null,
        alt: "No image available",
        index: 0
      });
    }

    return mediaItems;
  };

  const mediaItems = getMediaItems();

  const openVideoModal = (url) => {
    setSelectedVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl("");
  };

  if (mediaItems.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No media available for this property</p>
      </div>
    );
  }

  const currentMediaItem = mediaItems[selectedMediaIndex];

  return (
    <div className="overflow-hidden">
      <Gallery>
        <div className="flex flex-col items-center">
          {/* 🖼 Main Selected Media */}
          <div className="w-full max-w-2xl mb-4">
            {currentMediaItem.type === 'placeholder' ? (
              <div
                className="relative h-[500px] w-full rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#e8e8e8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-camera"
                  style={{
                    fontSize: "96px",
                    color: "#999",
                    marginBottom: "16px"
                  }}
                ></i>
                <span style={{
                  fontSize: "18px",
                  color: "#666",
                  fontWeight: "500"
                }}>
                  No Image Available
                </span>
              </div>
            ) : currentMediaItem.type === 'image' ? (
              currentMediaItem.url ? (
                <Item
                  original={currentMediaItem.url}
                  thumbnail={currentMediaItem.thumbnail}
                  width={800}
                  height={600}
                >
                  {({ ref, open }) => (
                    <div
                      className="relative h-[500px] w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                      ref={ref}
                      onClick={open}
                    >
                      <Image
                        src={currentMediaItem.url}
                        alt={currentMediaItem.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                      />
                    </div>
                )}
              </Item>
              ) : (
                <div
                  className="relative h-[500px] w-full rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: "#e8e8e8",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-camera"
                    style={{
                      fontSize: "96px",
                      color: "#999",
                      marginBottom: "16px"
                    }}
                  ></i>
                  <span style={{
                    fontSize: "18px",
                    color: "#666",
                    fontWeight: "500"
                  }}>
                    No Image Available
                  </span>
                </div>
              )
            ) : (
              // Video display
              <div
                className="relative h-[500px] w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition bg-black flex items-center justify-center"
                onClick={() => openVideoModal(currentMediaItem.url)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">Play Video</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🖼 Media Thumbnail Strip */}
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
            {mediaItems.map((mediaItem, index) => (
              <div
                key={`${mediaItem.type}-${index}`}
                className={`relative h-24 w-32 rounded-md overflow-hidden cursor-pointer border-2 ${
                  index === selectedMediaIndex
                    ? "border-green-600"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedMediaIndex(index)}
              >
                {mediaItem.type === 'placeholder' ? (
                  <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <i className="fas fa-camera" style={{ fontSize: "32px", color: "#999" }}></i>
                  </div>
                ) : mediaItem.type === 'image' ? (
                  mediaItem.thumbnail ? (
                    <Image
                      src={mediaItem.thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: "#e8e8e8" }}
                    >
                      <i className="fas fa-camera" style={{ fontSize: "32px", color: "#999" }}></i>
                    </div>
                  )
                ) : (
                  // Video thumbnail
                  <div className="relative w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                      VIDEO
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Gallery>

      {/* 🎬 Video Modal */}
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
              style={{ maxHeight: '80vh' }}
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