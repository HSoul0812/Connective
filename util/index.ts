import axios from "axios";
import Compress from "compress.js";

const profileConfigured = async (id: number) => {
  let configured = false;
  await axios.get(`/api/profiles/business/${id}`).then((res) => {
    if (typeof res.data != "undefined" && res.data != "") {
      configured = true;
    }
  });

  await axios.get(`/api/profiles/individual/${id}`).then((res) => {
    if (typeof res.data != "undefined" && res.data != "") {
      configured = true;
    }
  });

  return configured;
};

const accountType = async (id: number) => {
  let type = "none";
  await axios.get(`/api/profiles/business/${id}`).then((res) => {
    if (res.data.business) type = "Business";
  });
  await axios.get(`/api/profiles/individual/${id}`).then((res) => {
    if (res.data.individual) type = "Individual";
  });
  return type;
};

const uploadFile = async (name: string, file: Blob, image = false) => {
  if (image) {
    const compress = new Compress();
    let temp = await compress.compress(
      [file],
      {
        resize: true,
        rotate: false,
      },
      false
    );
    file = Compress.convertBase64ToFile(temp[0].data, temp[0].ext);
  }
  let response = await axios
    .post("/api/upload-file", {
      name: name,
      type: file.type,
    })
    .catch((e) => {
      console.log(e);
    });

  // @ts-ignore
  await axios.put(response.data.url, file, {
    headers: {
      "Content-type": file.type,
      "Access-Control-Allow-Origin": "*",
    },
  });

  // @ts-ignore
  return response.data.url.split("?")[0];
};

const verifyField = (
  value: string,
  setErrorText: (value: string) => void,
  errorTextValue: string
) => {
  if (value == "") {
    setErrorText(errorTextValue);
    return false;
  }
  return true;
};

export default {
  profileConfigured,
  accountType,
  uploadFile,
  verifyField,
};
