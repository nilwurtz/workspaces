import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Head from "next/head";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getServerSideProps = (async (context) => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = (await res.json()) as Repo;
  return { props: { repo } };
}) satisfies GetServerSideProps<{
  repo: Repo;
}>;

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <meta property="og:title" content={repo.name} />
      </Head>
      <div>{repo.stargazers_count}</div>
    </>
  );
}
