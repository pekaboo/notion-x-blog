import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { queryClient } from "src/libs/react-query"

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  const content = getLayout(<Component {...pageProps} />)

  // FullHTML 页面不包裹 RootLayout，避免头部等附加内容
  if ((pageProps as any)?.isFullHTML) {
    return (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>{content}</Hydrate>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RootLayout>{content}</RootLayout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
