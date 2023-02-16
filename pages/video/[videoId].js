import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import NavBar from "../../components/nav/navbar.component";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    async function getVideo() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();
    }
    getVideo();
  }, [videoId]);

  const handleCloseModal = () => {
    router.push("/");
  };

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited,
        watched: true,
      }),
    });
  };

  const handleToggleLike = async () => {
    setToggleLike(true);
    setToggleDisLike(false);
    const favourited = 1;
    const response = await runRatingService(favourited);
  };

  const handleToggleDislike = async () => {
    setToggleDisLike(true);
    setToggleLike(false);
    const favourited = 0;
    const response = await runRatingService(favourited);
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
          frameBorder="0"
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
