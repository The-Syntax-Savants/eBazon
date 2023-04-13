const Gradient = ({ reverse }) => {
  const gradientStyle = {
    background:
      "linear-gradient(90deg, #3f37c9 0%, #3a0ca3 22.4%, #560bad 42.71%, #7209b7 61.98%, #b5179e 81.77%, #f72585 100%)",
  };

  if (reverse) {
    gradientStyle.background =
      "linear-gradient(-90deg, #3f37c9 0%, #3a0ca3 22.4%, #560bad 42.71%, #7209b7 61.98%, #b5179e 81.77%, #f72585 100%)";
  }

  return <div className="w-full h-1" style={gradientStyle} />;
};

export default Gradient;
