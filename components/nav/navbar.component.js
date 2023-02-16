import styles from "./navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const NavBar = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { email } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        console.log("Error retrieving email", error);
      }
    };
    getUser();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropDown(!showDropDown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      await magic.user.logout();
      setUsername("");
      setShowDropDown(false);

      const response = await fetch("/api/logout");
      console.log({ response });

      router.push("/login");
    } catch (error) {
      console.log("Error with signout", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src="/static/netflix.svg"
              alt="Expand more"
              width="128"
              height="30"
            />
          </div>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>
                {username}
                {showDropDown ? (
                  <Image
                    src="/static/expandLess.svg"
                    alt="Expand more"
                    width="32"
                    height="32"
                  />
                ) : (
                  <Image
                    src="/static/expandMore.svg"
                    alt="Expand less"
                    width="32"
                    height="32"
                  />
                )}
              </p>
            </button>

            {showDropDown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>

                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
