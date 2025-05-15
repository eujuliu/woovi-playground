import { LoaderCircle, RotateCw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

type RefreshProps = {
  loading: boolean;
  onClick: () => void;
};

export const Refresh = ({ loading, onClick }: RefreshProps) => {
  return (
    <Button type="button" variant="ghost" onClick={onClick} disabled={loading}>
      {loading ? <LoaderCircle className="animate-spin" /> : <RotateCw />}
    </Button>
  );
};
