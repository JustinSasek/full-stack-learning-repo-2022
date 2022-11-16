import React, { useEffect, useState } from "react";

export default function FileUploadPage({ handleSubmission }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    console.log("change handler called")
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
    // console.log("2")
    setIsSelected(true);
    // console.log("3")
  };

  const submit = (selectedFile) => {
    handleSubmission(selectedFile)
    setIsSelected(false)
    setSelectedFile(null)
  }

  useEffect(() => {
    console.log(selectedFile);
    if (selectedFile) {
      const date = new Date(selectedFile.lastModified / 1000000)
      console.log("lastModified: " + date)
    }
  }, [selectedFile]);
  useEffect(() => {
    console.log("isSelected changed to " + isSelected);
  }, [isSelected]);

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {isSelected ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModified:{" "}
            {(new Date(selectedFile.lastModified / 1000000)).toString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={() => submit(selectedFile)}>Submit</button>
      </div>
    </div>
  );
}
