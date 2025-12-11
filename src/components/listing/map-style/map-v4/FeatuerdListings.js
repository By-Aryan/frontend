
import Image from "next/image";
import Link from "next/link";

const FeaturedListings = ({data,colstyle}) => {


  return (
    <>
      {data.map((listing) => (
        <div className={`${colstyle ? 'col-sm-12 col-lg-6':'col-sm-6'}  `} key={listing.id}>
          <div className={`${colstyle ? "listing-style6 listCustom listing-type" : "listing-style6"} ${listing.is_boosted || listing.isBoosted ? 'boosted-listing' : ''}`}>
            <div className="list-thumb"   >
              <Image
                width={386}
                height={334}
                className="w-100 cover"
                style={{height:'334px'}}
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

              <div className="list-meta">
                <div className="icons">
                  <a href="#">
                    <span className="flaticon-like" />
                  </a>
                  <a href="#">
                    <span className="flaticon-new-tab" />
                  </a>
                  <a href="#">
                    <span className="flaticon-fullscreen" />
                  </a>
                </div>
              </div>
            </div>
            <div className="list-content">
              <div className="list-price mb-2">{listing.price}</div>
              <h6 className="list-title">
                <Link href={`/single-v5/${listing.id}`}>{listing.title}</Link>
              </h6>
              <p className="list-text">
                {typeof listing.location === 'string' 
                  ? listing.location 
                  : listing.location?.address || `${listing.location?.city || ''}, ${listing.location?.emirate || ''}`
                }
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedListings;
