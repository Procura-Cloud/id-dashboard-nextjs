import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    width: "243pt", // CR80 width (3.375 inches * 72 pt)
    height: "153pt", // CR80 height (2.125 inches * 72 pt)s
    flexDirection: "row",
    padding: 30,
    fontSize: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  image: {
    width: "57pt",
    height: "68pt",
  },
});

// ID Component
export const MyDocument = ({ name, idNumber, photoUrl }) => {
  console.log("Photo:", photoUrl);

  return (
    <Document>
      <Page size={{ width: 153, height: 243 }} style={styles.page}>
        <View>
          <View>
            <img
              src="https://candidate-photo-upload.s3.ap-south-1.amazonaws.com/images/1732959713673-4918e5c9-40cc-4d3f-8d0e-2990b6a4d36b.png"
              style={{ width: "57pt", height: "68pt" }}
            />
          </View>
          <View>
            <Text>Name: {name}</Text>
            <Text>ID: {idNumber}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
