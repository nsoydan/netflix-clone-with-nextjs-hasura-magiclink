import styles from "./sectionCards.module.css";
import Card from "./card.component";
import Link from "next/link";
import clsx from "classnames";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title} </h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos &&
          videos.map((video) => (
            <Link key={video.id} href={`/video/${video.id}`}>
              <Card
                id={video.id}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default SectionCards;
