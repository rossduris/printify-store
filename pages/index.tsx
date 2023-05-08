import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({
    name: "",
    url: "",
  });

  const uploadFromUrl = async () => {
    setIsLoading(true);
    const response = await fetch("/api/printify/upload-image", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        name: image.name,
        url: image.url,
      }),
    });
    const data = await response.json();
    console.log(data);
    setIsLoading(true);
  };

  return (
    <div>
      <h1>Printify Store</h1>
      <div>
        <h2>Create Product</h2>
        <div>
          <h3>Preview</h3>
          <img src={image.url} className=" w-40 h-40" />
        </div>

        <input
          className=" text-slate-400"
          type="text"
          id="fileName"
          name="fileName"
          placeholder="File name"
          onChange={(e) => setImage({ ...image, name: e.target.value })}
        />
        <input
          className=" text-slate-400"
          type="text"
          id="fileUrl"
          name="fileUrl"
          placeholder="File url"
          onChange={(e) => setImage({ ...image, url: e.target.value })}
        />

        <button onClick={() => uploadFromUrl()}>
          {isLoading ? "Loading..." : "Upload Image"}
        </button>
      </div>
    </div>
  );
}
