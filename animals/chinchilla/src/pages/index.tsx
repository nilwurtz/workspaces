import { NextPage, GetServerSideProps } from "next"
import Head from "next/head"
import { getCardHtml } from "../lib/api"

type Props = {
  card: string
}

const Index: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: props.card }} />
      </Head>

      <div>
        <h1>Cincilla Page</h1>

      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const card = await getCardHtml()
  return {
    props: { card }
  }
}

export default Index;