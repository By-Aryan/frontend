
const Map = ({latitude, longitude}) => {
  return (
    <iframe
      className="h550"
      loading="lazy"
      src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=m&z=14&output=embed&iwloc=near`}
      title="London Eye, London, United Kingdom"
      aria-label="London Eye, London, United Kingdom"
    />
  );
};

export default Map;
