type PropType = {
  numElements: number;
  progressIndex: number;
};

export const OnboardingControls = (props: PropType) => {
  const { numElements, progressIndex } = props;

  const circles = Array.from({ length: numElements }, (_, index) => index).map(
    (i) => (
      <div
        style={{
          margin: 10,
          cursor: 'default',
        }}
        key={i}
      >
        {i < progressIndex ? '✅' : i === progressIndex ? '😀' : '⚫'}
      </div>
    ),
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25%',
        position: 'absolute',
        bottom: '10%',
      }}
    >
      {circles}
    </div>
  );
};
