import { goerli, polygonMumbai, sepolia } from "viem/chains";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
// import { sepolia, polygonMumbai, goerli } from "@wagmi/core/chains";
// import { injected } from "@wagmi/connectors";

// import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygonMumbai, goerli],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
  },
  ssr: true,
});
