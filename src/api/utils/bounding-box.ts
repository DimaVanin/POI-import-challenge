export const boundingBoxStringToParams = (
  string: string,
): {
  lat1: number | null;
  lng1: number | null;
  lat2: number | null;
  lng2: number | null;
} => {
  const matchResult = string.match(
    /\((-?\d*\.?\d*),(-?\d*\.?\d*)\),\((-?\d*\.?\d*),(-?\d*\.?\d*)\)/,
  );

  if (matchResult === null) {
    return { lat1: null, lng1: null, lat2: null, lng2: null };
  }

  const [, lat1, lng1, lat2, lng2] = matchResult;

  return {
    lat1: parseFloat(lat1),
    lng1: parseFloat(lng1),
    lat2: parseFloat(lat2),
    lng2: parseFloat(lng2),
  };
};
