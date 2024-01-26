import React, { useEffect, useRef } from "react";
import axios from "axios";

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const model = "whisper-1";

const HomePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [response, setResponse] = React.useState<string | null>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    console.log(file);

    const fetchData = async () => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);

      try {
        const res = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
            },
          }
        );

        setResponse(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [file]);

  return (
    <>
      <div className="p-16 rounded-xl">
        Whisper
        <input
          type="file"
          ref={inputRef}
          accept=".mp3"
          onChange={onChangeFile}
          className="block mt-16"
        />
      </div>
      {response && <div> {JSON.stringify(response, null, 2)}</div>}
    </>
  );
};

export default HomePage;
