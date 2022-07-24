import prettyBytes from "pretty-bytes";

interface SectionalSizeProps {
  blob: Blob;
}

export default function SectionalSize({ blob }: SectionalSizeProps) {
  return <>{prettyBytes(blob.size)}</>;
}
