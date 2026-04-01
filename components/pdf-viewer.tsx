"use client"

import dynamic from "next/dynamic"

const PdfViewerClient = dynamic(() => import("./pdf-viewer-client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export function PdfViewer({ url }: { url: string }) {
  return <PdfViewerClient url={url} />
}
