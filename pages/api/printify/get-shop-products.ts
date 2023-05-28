import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, url } = req.body;

  const token = process.env.PRINTIFY_API;
  const bearer = "Bearer " + token;
  const apiUrl = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "NodeJS",
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
