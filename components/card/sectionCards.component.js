import styles from "./sectionCards.module.css";
import Card from "./card.component";
import Link from "next/link";

const SectionCards = (props) => {
  const { title, videos = [], size } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title} </h2>
      <div className={styles.cardWrapper}>
        {videos &&
          videos.map((video) => (
            <Link key={video.id} href={`/video/${video.id}`}>
              <Card id={video.id} imgUrl={video.imgUrl} size={size} />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default SectionCards;
