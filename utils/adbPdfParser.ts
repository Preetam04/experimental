import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import pdf2md from "@opendocsg/pdf2md";

// const credentials = new ServicePrincipalCredentials({
//   clientId: process.env.PDF_SERVICES_CLIENT_ID ?? "",
//   clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET ?? "",
// });

// // const pdfServices = new PDFServices({ credentials });

export async function pdfParser(file: File) {
  try {
    // const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(await file.arrayBuffer());

    // const contentBlob = new Blob([buffer], { type: "application/pdf" });

    // const loader = new WebPDFLoader(contentBlob, {
    //   // required params = ...
    //   // optional params = ...
    //   splitPages: false,
    // });

    // console.log((await loader.load())[0].metadata);
    // return (await loader.load())[0].pageContent;
    const markdown = await pdf2md(buffer);
    console.log(markdown);

    return markdown;
  } catch (error) {
    console.log(error);
  }
}
