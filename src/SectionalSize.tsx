import prettyBytes from "pretty-bytes";

interface SectionalSizeProps {
  blobs: Blob[];
}

export default function SectionalSize({ blobs }: SectionalSizeProps) {
  return <>{prettyBytes(blobs.reduce((prev, curr) => prev + curr.size, 0))}</>;
}
