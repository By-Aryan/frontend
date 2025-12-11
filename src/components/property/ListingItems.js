
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../../styles/boost-indicators.css";

const ListingItems = ({data}) => {


  return (
    <>
      {data?.map((listing) => (
        <div className="col-md-6" key={listing.id}>
          <div className={`listing-style1 ${listing.is_boosted || listing.isBoosted ? 'boosted-listing' : ''}`}>
            <div className="list-thumb">
              <Image
                width={382}
                height={248}
                className="w-100 h-100 cover"
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
                {listing.featured && !listing.is_boosted && !listing.isBoosted && (
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
                <Link href={`/single-v1/${listing.id}`}>{listing.title}</Link>
              </h6>
              <p className="list-text">
                {typeof listing.location === 'string' 
                  ? listing.location 
                  : listing.location?.address || 
                    `${listing.location?.city || ''}, ${listing.location?.emirate || ''}`.replace(/^, |, $/, '') || 
                    'Location not available'
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

export default ListingItems;
