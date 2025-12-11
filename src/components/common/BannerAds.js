"use client";
import AdsDisplay from './AdsDisplay';

const BannerAds = ({ 
  placement = 'banner', 
  className = '',
  horizontal = true 
}) => {
  return (
    <div className={`banner-ads-widget ${className}`}>
      <AdsDisplay 
        placement={placement}
        maxAds={1}
        showTitle={false}
        responsive={true}
        className={horizontal ? 'banner-horizontal' : 'banner-vertical'}
      />
      
      <style jsx>{`
        .banner-ads-widget {
          margin: 20px 0;
        }

        .banner-ads-widget :global(.banner-horizontal .ad-item) {
          display: flex;
          align-items: center;
          padding: 20px;
          max-height: 120px;
        }

        .banner-ads-widget :global(.banner-horizontal .ad-image-container) {
          width: 150px;
          height: 100px;
          margin-right: 20px;
          flex-shrink: 0;
        }

        .banner-ads-widget :global(.banner-horizontal .ad-content) {
          flex: 1;
          margin-top: 0;
        }

        .banner-ads-widget :global(.banner-horizontal .ad-title) {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .banner-ads-widget :global(.banner-horizontal .ad-description) {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .banner-ads-widget :global(.banner-horizontal .ad-item) {
            flex-direction: column;
            text-align: center;
            max-height: none;
          }

          .banner-ads-widget :global(.banner-horizontal .ad-image-container) {
            width: 100%;
            height: 150px;
            margin-right: 0;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerAds;