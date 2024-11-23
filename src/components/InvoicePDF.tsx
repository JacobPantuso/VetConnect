import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    objectFit: "contain",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  tableFooter: {
    marginTop: 10,
    textAlign: "right",
    paddingRight: 10,
  },
});

export type InvoiceData = {
    clientName: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    lastDigits: string;
    items: {
        description: string;
        rate: number;
        duration: string;
    }[];
    subTotal: number;
};

interface InvoicePDFProps {
    invoiceData: InvoiceData;
}

const InvoicePDF = ({ invoiceData }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={'/invoice-logo.png'} style={styles.logo} />
        <Text style={styles.invoiceTitle}>INVOICE</Text>
      </View>

      {/* Company & Client Details */}
      <View style={styles.section}>
        <Text>Vet Connect</Text>
        <Text>350 King Street West, Toronto, ON, Canada</Text>
      </View>
      <View style={styles.section}>
        <Text>Bill To:</Text>
        <Text>{invoiceData.clientName}</Text>
      </View>

      {/* Invoice Details */}
      <View style={styles.section}>
        <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
        <Text>Invoice Date: {invoiceData.invoiceDate}</Text>
        <Text>Due Date: {invoiceData.dueDate}</Text>
        <Text>Paid: ****{invoiceData.lastDigits}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Service</Text>
          <Text style={styles.tableCell}>Rate</Text>
          <Text style={styles.tableCell}>Duration</Text>
        </View>
        {invoiceData.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>${item.rate}/hr</Text>
            <Text style={styles.tableCell}>
              {item.duration}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.tableFooter}>
        <Text>Sub Total: ${invoiceData.subTotal.toFixed(2)}</Text>
        <Text>Sale Tax (13%): ${(invoiceData.subTotal*0.13).toFixed(2)}</Text>
        <Text>Total: ${(invoiceData.subTotal*1.13).toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
