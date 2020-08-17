import React from "react";
import { CircularProgress, Dialog, Slide } from "@material-ui/core";
import { getAuxiliar } from "../Api";
import { mapAuxiliarToPdf } from "../form-tcc/dataFormat";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Create Document Component
export default function PdfDentista(props) {
  const [data, setData] = React.useState(null);
  const [erro, setErro] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    getAuxiliar(props.idAuxiliar, props.idUser, props.setToken, gerarPdf, showError);
    setOpen(true);
  }, [props.idAuxiliar]);

  const showError = (err) => {
    setErro("Falha ao buscar registro");
  };

  const gerarPdf = (res) => {
    setData(
      <Document>
        <Page size="A4" style={styles.page} wrap>
          {mapAuxiliarToPdf(res.data)}
        </Page>
      </Document>
    );
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={(e) => setOpen(false)}
      onClick={(e) => setOpen(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {data === null && erro === null && <CircularProgress />}
      {erro !== null && <span>{erro}</span>}
      {data !== null && (
        <PDFDownloadLink document={data} fileName={"auxiliar_" + props.idAuxiliar + ".pdf"}>
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
        </PDFDownloadLink>
      )}
    </Dialog>
  );
}
