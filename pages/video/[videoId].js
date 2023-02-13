import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import NavBar from "../../components/nav/navbar.component";
import { useState } from "react";
import clsx from "classnames";

import { getYoutubeVideoById } from "../../lib/videos";
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },

    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  const { videoId } = router.query;
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount },
  } = video;

  const handleCloseModal = () => {
    //console.log("deneme");
    router.push("/");
  };
  const handleToggleLike = () => {
    console.log("like");
    setToggleLike(true);
    setToggleDisLike(false);
  };
  const handleToggleDislike = () => {
    console.log("dislike");
    setToggleDisLike(true);
    setToggleLike(false);
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={handleCloseModal}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          className={styles.videoPlayer}
          id="player"
          type="text/html"
          width="100%"
          height="390"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=0`}
          frameborder="0"
        />
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>

          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast : </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count : </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
