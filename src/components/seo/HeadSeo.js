import Head from "next/head";

export default function HeadSeo({ title, description, canonical }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
