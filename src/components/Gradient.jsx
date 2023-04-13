const Gradient = () => {
  return (
    <>
      <span id="gradient" />
      <style>{`
          #gradient {
            position: relative;
            display: flex;
            width: 100%;
            height: 5px !important;
            background: linear-gradient(
              90deg,
              #3f37c9 0%,
              #3a0ca3 22.4%,
              #560bad 42.71%,
              #7209b7 61.98%,
              #b5179e 81.77%,
              #f72585 100%
            );
          }
        `}</style>
    </>
  );
};

export default Gradient;
