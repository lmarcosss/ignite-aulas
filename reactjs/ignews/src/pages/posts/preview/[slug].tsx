import { useSession } from 'next-auth/client';
import { getPrismicClient } from '../../../services/prismic';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import router from 'next/router';

import styles from '../post.module.scss';

const THIRTY_MINUTES = 60 * 30;

interface Props {
  post: {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    updatedAt: string;
  };
}
export default function PostPreview({ post }: Props) {
  const [session] = useSession();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 5)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: { post },
    redirect: THIRTY_MINUTES,
  };
};
