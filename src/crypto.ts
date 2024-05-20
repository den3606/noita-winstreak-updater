const fromHexString = (hexString: string): Uint8Array => {
  try {
    const byteArray = hexString.match(/.{1,2}/g) ?? [];
    return new Uint8Array(byteArray.map((byte) => Number.parseInt(byte, 16)));
  } catch (e) {
    throw new Error("key or iv are invalid");
  }
};

const fileCryptoValues = [
  {
    key: fromHexString("536563726574734f66546865416c6c53"),
    iv: fromHexString("54687265654579657341726557617463"),
    name: "_stats.salakieli",
  },
  {
    key: fromHexString("4b6e6f776c6564676549735468654869"),
    iv: fromHexString("57686f576f756c646e74476976654576"),
    name: "magic_numbers.salakieli",
  },
  {
    key: fromHexString("4b6e6f776c6564676549735468654869"),
    iv: fromHexString("57686f576f756c646e74476976654576"),
    name: "session_numbers.salakieli",
  },
  // {
  //   key: fromHexString('31343439363631363932313933343032'),
  //   iv: fromHexString('38313632343338393133393638333733'),
  //   name: '?',
  // },
];

const getKey = (targetName: string): Uint8Array | undefined => {
  return fileCryptoValues.find((value) => value.name === targetName)?.key;
};

const getIv = (targetName: string): Uint8Array | undefined => {
  return fileCryptoValues.find((value) => value.name === targetName)?.iv;
};

export const decrypt = async (fileName: string, encryptedData: ArrayBuffer) => {
  const key = getKey(fileName);
  const iv = getIv(fileName);

  if (key == null || iv == null) {
    throw new Error("This file type is not register");
  }

  const cryptoKey = await crypto.subtle.importKey("raw", key, "AES-CTR", false, ["encrypt", "decrypt"]);

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-CTR",
      counter: iv,
      length: 128,
    },
    cryptoKey,
    encryptedData,
  );

  const textDecoder = new TextDecoder();
  return textDecoder.decode(decryptedData);
};

// function xcrypt(data, pred) {

// }

// const read = (encryptedData: ArrayBuffer) => {

//     xcrypt(reader.result,
//   reader.readAsArrayBuffer(file);
// }
// function toAscii(str) {
//   let array = new Uint8Array(str.length);
//   for (i = 0; i < str.length; ++i) {
//     array[i] = str.charCodeAt(i);
//   }
//   return array;
// }
// function save() {
// xcrypt(toAscii(fileOuput.value), function (xcrypted_content) {
//   let blob = new Blob([xcrypted_content]);
//   var pom = document.createElement('a');
//   pom.setAttribute('download', fileCryptoValues[fileSelect.value].name);
//   const objectURL = URL.createObjectURL(blob);
//   pom.setAttribute('href', objectURL);
//   console.log(objectURL);
//   if (document.createEvent) {
//     var event = document.createEvent('MouseEvents');
//     event.initEvent('click', true, true);
//     pom.dispatchEvent(event);
//   } else {
//     pom.click();
//   }
//   URL.revokeObjectURL(objectURL);
// });
// }
