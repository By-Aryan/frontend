import listings from "@/data/listings";
import Image from "next/image";
import Link from "next/link";

const FeaturedListings = ({data,colstyle}) => {


  return (
    <>
      {data.map((listing) => (
        <div  className={` ${colstyle ? 'col-sm-12':'col-sm-6 col-lg-4'}  `} key={listing.id}>
          <div className={`${colstyle ? "listing-style6 listCustom listing-type" : "listing-style6"} ${listing.is_boosted || listing.isBoosted ? 'boosted-listing' : ''}`}>
            <div className="list-thumb"    >
              <Image
                width={386}
                height={334}
                className="w-100  cover"
                style={{height:'309px'}}
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
                  borderRadius: '4px'
                }}>
                  <span className="fas fa-rocket me-2" />
                  BOOSTED
                </div>
              ) : null}

              <div className="sale-sticker-wrap">
                {listing.forRent && !listing.is_boosted && !listing.isBoosted && (
                  <div className="list-tag rounded-0 fz12">
                    <span className="flaticon-electricity" />
                    FEATURED
                  </div>
                )}
                <div className="list-tag2 rounded-0 fz12">FOR SALE</div>
              </div>
              <div className="list-meta">
                <a className="rounded-0 mr5" href="#">
                  <span className="flaticon-like"></span>
                </a>
                <a className="rounded-0 mr5" href="#">
                  <span className="flaticon-new-tab"></span>
                </a>
                <a className="rounded-0" href="#">
                  <span className="flaticon-fullscreen"></span>
                </a>
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedListings;
