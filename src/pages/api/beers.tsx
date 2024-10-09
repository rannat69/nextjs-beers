import type { NextApiRequest, NextApiResponse } from "next";

export type Beer = {
  id: number;
  name: string;
  price: string;
  rating: {
    average: number;
    reviews: number;
  };
  image: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Beer[]>
) {
  console.log("req", req);

  const dataBeer = await fetch("https://api.sampleapis.com/beers/ale");
  let beers: Beer[] = await dataBeer.json();

  res.status(200).json(beers);
}
