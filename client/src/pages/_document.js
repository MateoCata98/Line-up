import { Html, Head, Main, NextScript } from "next/document";
import Message from "@/components/PromotionalMessage/Message";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Message />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
