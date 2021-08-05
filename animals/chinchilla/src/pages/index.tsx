import { NextPage, GetServerSideProps } from "next"
import { getCardHtml } from "../lib/api"

type Props = {
  card: string
}

const Index: NextPage<Props> = (props) => {
  return (
    <div>
      <h1>Cincilla Page</h1>
      <div dangerouslySetInnerHTML={{ __html: props.card }}></div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  console.log("-----")
  const card = await getCardHtml()
  console.log(card)
  return {
    props: {
      card: card
    }
  }
}

export default Index;