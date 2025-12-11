"use client";

import Image from "next/image";
import Link from "next/link";

const FeaturedListings = ({ data, colstyle }) => {


  return (
    <>
      {data.map((listing) => (
        <div
          className={` ${colstyle ? "col-sm-6 col-lg-6" : "col-sm-12"}  `}
          key={listing.id}
        >
          <div
            className={`${
              colstyle
                ? "listing-style1"
                : "listing-style1 listCustom listing-type"
            } ${listing.is_boosted || listing.isBoosted ? 'boosted-listing' : ''}`}
          >
            <div className="list-thumb">
              <Image
                width={382}
                height={248}
                className="w-100  cover"
                style={{ height: "253px" }}
                src={listing.image}
                alt="listings"
              />
              {/* Enhanced boost indicator - positioned on left */}
              {listing.is_boosted || listing.isBoosted || listing.featured ? (
                <div className="boosted-tag" style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  left: '15px', 
                  zIndex: 10,
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '20px'
                }}>
                  <span className="fas fa-rocket me-2" />
                  BOOSTED
                </div>
              ) : null}

              <div className="sale-sticker-wrap">
                {!listing.forRent && !listing.is_boosted && !listing.isBoosted && (
                  <div className="list-tag fz12">
                    <span className="flaticon-electricity me-2" />
                    FEATURED
                  </div>
                )}
              </div>

              <div className="list-price">
                {listing.price} / <span>mo</span>
              </div>


            </div>
            <div className="list-content">
              <h6 className="list-title">
                <Link href={`/single-v4/${listing.id}`}>{listing.title}</Link>
              </h6>
              <p className="list-text">
                {typeof listing.location === 'string' 
                  ? listing.location 
                  : listing.location?.address || `${listing.location?.city || ''}, ${listing.location?.emirate || ''}`
                }
              </p>
              <div className="list-meta d-flex align-items-center">
                <a href="#">
                  <span className="flaticon-bed" /> {listing.bed} bed
                </a>
                <a href="#">
                  <span className="flaticon-shower" /> {listing.bath} bath
                </a>
                <a href="#">
                  <span className="flaticon-expand" /> {listing.sqft} sqft
                </a>
              </div>
              <p className="list-text2">
                An exceptional exclusive five bedroom apartment for sale in this
                much sought after development in Knightsbridge.
              </p>
              <hr className="mt-2 mb-2" />
              <div className="list-meta2 d-flex justify-content-between align-items-center">
                <span className="for-what">For Rent</span>
                <div className="icons d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-fullscreen" />
                  </a>
                  <a href="#">
                    <span className="flaticon-new-tab" />
                  </a>
                  <a href="#">
                    <span className="flaticon-like" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedListings;
