import { http, createConfig } from 'wagmi'
import { sepolia } from '@wagmi/core/chains'
import { injected } from '@wagmi/connectors'

// import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true, 
})
