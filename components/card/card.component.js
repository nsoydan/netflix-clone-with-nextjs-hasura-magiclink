import styles from "./card.module.css";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import cls from "classnames";
const Card = (props) => {
  const { imgUrl, size = "medium", id, shouldScale = true } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2059&q=80"
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const shouldHover = shouldScale && { whileHover: { ...scale } };
  return (
    <div className={styles.container}>
      <motion.div
        {...shouldHover}
        className={cls(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          className={styles.cardImg}
          src={imgSrc}
          alt="image"
          fill
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
