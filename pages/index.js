import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner/banner.component";
import NavBar from "../components/nav/navbar.component";
import SectionCards from "../components/card/sectionCards.component";
import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import { redirectUser } from "../utils/redirectUser";
export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context);

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailers");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();

  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home(props) {
  const {
    disneyVideos,
    travelVideos,
    productivityVideos,
    popularVideos,
    watchItAgainVideos,
  } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone with Next.js</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar userName="Guess" />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Cliffeord the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.jpg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney " videos={disneyVideos} size="large" />

          <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </main>
    </div>
  );
}
