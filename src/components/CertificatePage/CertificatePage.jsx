import React, { useState  , useEffect} from "react";
import { IIconProps, IconButton, initializeIcons } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import CertificateUploadField from "./CertificateUploadField/CertificateUploadField";
import "./CertificatePage.css";

const CertificatePage = () => {
  const [certificateFieldList, setCertificateFieldList] = useState([0]);
  const addIcon = { iconName: "Add" };

  initializeIcons();

  const _alertClicked = () => {
    const cerficateLength = certificateFieldList.length;
    setCertificateFieldList([...certificateFieldList, cerficateLength]);
  };

  const deleteRow = (index = 0) => {
    setCertificateFieldList(
      certificateFieldList.filter(item => item !== index - 4)
    );
  };

  return (
    <div className="certificate-page">
      <Text variant={"large"}>Certificate optional</Text>
      {certificateFieldList.map((value, index) => {
        return (
          <CertificateUploadField
            fieldIndex={value + 4}
            key={index}
            deleteCallback={deleteRow}
          />
        );
      })}

      <div onClick={_alertClicked} className="add-button">
        <IconButton
          iconProps={addIcon}
          splitButtonAriaLabel="See 2 options"
          aria-roledescription="split button"
          ariaLabel="New item"
        />
        <Text>Add </Text>
      </div>

      <button > coverter</button>
    </div>
  );
};

export default CertificatePage;
