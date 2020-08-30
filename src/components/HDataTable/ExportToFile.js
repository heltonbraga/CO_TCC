import React from "react";
import { CircularProgress, Dialog, Slide } from "@material-ui/core";
import { PDFDownloadLink, Page, Document } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const toExcel = (registros, fileName, mapping, successCallback, errorCallback) => {
  if (!registros || registros.length === 0) {
    errorCallback("Nenhum registro gerado!");
  }
  let data = registros.map((d) => {
    return mapping(d);
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const arquivo = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  FileSaver.saveAs(arquivo, fileName + ".xlsx");
  successCallback();
};

export const PdfDialog = (props) => {
  const [data, setData] = React.useState(null);
  const [erro, setErro] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    props.getEntidade(props.idEntidade, props.idUser, props.token, gerarPdf, showError);
    setOpen(true);
  }, [props.idEntidade]);

  const showError = (err) => {
    setErro("Falha ao buscar registro");
  };

  const gerarPdf = (res) => {
    setData(
      <Document>
        <Page size="A4" style={{ flexDirection: "row" }} wrap>
          {props.mapping(res.data)}
        </Page>
      </Document>
    );
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      })}
      keepMounted
      onClose={(e) => { props.onClose(); setOpen(false); }}
      onClick={(e) => { props.onClose(); setOpen(false); }}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {data === null && erro === null && <CircularProgress />}
      {erro !== null && <span>{erro}</span>}
      {data !== null && (
        <PDFDownloadLink document={data} fileName={props.fileName + ".pdf"}>
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
        </PDFDownloadLink>
      )}
    </Dialog>
  );
}