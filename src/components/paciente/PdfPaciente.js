import React from "react";
import { CircularProgress, Dialog, Slide } from "@material-ui/core";
import { getPaciente } from "../Api";
import { mapPacienteToPdf } from "../form-tcc/dataFormat";
import { PDFDownloadLink, Page, Document, StyleSheet } from "@react-pdf/renderer";

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
export default function PdfPaciente(props) {
  const [data, setData] = React.useState(null);
  const [erro, setErro] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    getPaciente(props.idPaciente, props.setToken, gerarPdf, showError);
    setOpen(true);
  }, [props.idPaciente]);

  const showError = (err) => {
    setErro("Falha ao buscar registro");
  };

  const gerarPdf = (res) => {
    console.log(res);
    setData(
      <Document>
        <Page size="A4" style={styles.page} wrap>
          {mapPacienteToPdf(res.data)}
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
        <PDFDownloadLink document={data} fileName={"paciente_" + props.idPaciente + ".pdf"}>
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
        </PDFDownloadLink>
      )}
    </Dialog>
  );
}
