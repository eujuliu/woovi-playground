import { Suspense, useMemo } from "react";
import { createEnvironment } from "./environment";
import { type NextPageWithLayout, RelayHydrate } from "./RelayHydrate";
import { ReactRelayContext } from "react-relay";
import { Toaster } from "@/components/ui/Sonner";

export function ReactRelayContainer<T>({
  Component,
  props,
}: {
  Component: NextPageWithLayout<T>;
  props: any;
}) {
  const environment = useMemo(() => createEnvironment(), []);
  return (
    <ReactRelayContext.Provider value={{ environment }}>
      <Suspense fallback={null}>
        <Toaster />
        <RelayHydrate Component={Component} props={props} />
      </Suspense>
    </ReactRelayContext.Provider>
  );
}
