import listings from "@/data/listings";
import Image from "next/image";
import Link from "next/link";

const FeaturedListings = ({data,colstyle}) => {


  return (
    <>
      {data.map((listing) => (
        <div  className={` ${colstyle ? 'col-sm-12':'col-sm-6'}  `} key={listing.id}>
          <div className={`${colstyle ? "listing-style1 listCustom listing-type" : "listing-style1"} ${listing.is_boosted || listing.isBoosted ? 'boosted-listing' : ''}`}>
            <div className="list-thumb"    >
              <Image
                width={382}
                height={248}
                className="w-100 cover"
                src={listing.image}
                style={{height:'240px'}}
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
                  borderRadius: '20px',
                  background: listing.forRent 
                    ? 'linear-gradient(135deg, #17a2b8, #138496)' 
                    : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  color: 'white'
                }}>
                  <span className={`fas ${listing.forRent ? 'fa-home' : 'fa-rocket'} me-2`} />
                  {listing.forRent ? 'RENTAL BOOST' : 'BOOSTED'}
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
                <Link href={`/single-v5/${listing.id}`}>{listing.title}</Link>
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
