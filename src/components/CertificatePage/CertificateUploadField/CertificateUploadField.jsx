import React, { useEffect, useRef  , useState} from "react";

import { TextField } from "@fluentui/react/lib/TextField";
import { DefaultButton } from "@fluentui/react/lib/Button";

import { Text } from "@fluentui/react/lib/Text";
import { IIconProps, IconButton, initializeIcons } from "@fluentui/react";

import "./CertificateUploadField.css";
import forge from 'node-forge';
import { CertificateUpload } from "../CertificateUpload/CertificateUpload";


const CertificateUploadField = ({ fieldIndex  , deleteCallback}) => {
  
  const deleteIcon = { iconName: "Delete" };
  const [certificate, setCertificate] = useState(null);
  
  const hiddenFileInput = useRef();
  const showFile = async (e ) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result || '';
      setCertificate(text);
    };
    reader.readAsText(e.target.files[0]);
  };



  useEffect(() => {
    if (certificate != null) {
      const forgedCertificate = forge.pki.certificateFromPem(certificate);
      const publicKey = forgedCertificate.publicKey ;
      const rsaPublicKey = forge.pki.publicKeyToRSAPublicKey(publicKey);
      console.log('rsaPublicKey', rsaPublicKey);
      const encoded = forge.asn1
        .toDer(forge.pki.certificateToAsn1(forgedCertificate))
        .getBytes();

      const x5t = forge.md.sha1
        .create()
        .update(encoded)
        .digest()
        .data.toString();

      const x5t256 = forge.md.sha256
        .create()
        .update(encoded)
        .digest()
        .data.toString();
        
     

      const sdJwk = {
        kid: '',
        kty: 'RSA',
        key_ops: ['verify', 'encrypt', 'wrapKey'],
        n: btoa(forge.util.hexToBytes(publicKey.n.toString(16))),
        e: btoa(forge.util.hexToBytes(publicKey.e.toString(16))),
        x5c: [btoa(encoded)],
        use: '',
        x5t: btoa(x5t),
        x5t256: btoa(x5t256),
        alg: 'RSA-OAEP-256',
      };

      console.log('sdjwk', sdJwk);
    }
  }, [certificate]);

  const handleClick = () => {
    const fileInput =  hiddenFileInput.current ;
    fileInput.click();
  };

  const _alertClicked = () => {
    alert("Clicked");
  };

  const deleteRow = () => {
    deleteCallback(fieldIndex);
  };

  

  return (
    <div className="uploadFieldContainer">
      <Text className="uploadFieldComponent">
        {" "}Certificate {fieldIndex}
      </Text>
      <TextField
        className="uploadFieldComponent"
        placeholder="Select File here"
      />
      <input
        type="file"
        onChange={(e) => showFile(e)}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
      <DefaultButton
        text="Browse"
        onClick={handleClick}
        className="uploadFieldComponent"
      />
      <IconButton
        iconProps={deleteIcon}
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        ariaLabel="New item"
        onClick={deleteRow}
      />
      <CertificateUpload  label={'select file'} onUpload={()=>{}} />
    </div>
  );
};

export default CertificateUploadField;
