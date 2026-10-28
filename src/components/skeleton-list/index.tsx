import { Skeleton } from "antd";
import type { FC, ReactNode } from "react";

type SkeletonListProps = {
  loading: boolean;
  rows?: number;
  children: ReactNode;
};

export const SkeletonList: FC<SkeletonListProps> = ({ loading, rows = 5, children }) => {
  if (!loading) return <>{children}</>;
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton
          key={i}
          active
          title={false}
          paragraph={{ rows: 1, width: ["100%"] }}
          style={{ padding: "12px 16px", background: "var(--spade-surface)", borderRadius: 10, marginBottom: 8 }}
        />
      ))}
    </>
  );
};
