import Head from "next/head";
import Link from "next/link";
import styles from "../styles/login.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import { validateEmail } from "../lib/emailValidation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    const handleChangeError = () => {};

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleChangeError);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleChangeError);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");

    setEmail(e.target.value);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    const validateReturn = validateEmail(email);

    if (email && validateReturn) {
      setIsLoading(true);

      try {
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });
        console.log({ didToken });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something wrong with logging in");
            router.push("/login");
          }
        }
      } catch (error) {
        console.log({ error });
      }
    } else {
      setUserMsg("Enter a valid email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/" legacyBehavior>
            <a>
              <div className={styles.logoWrapper}>
                <Image
                  src="/static/netflix.svg"
                  alt="Netflix logo"
                  width="128"
                  height="34"
                />
              </div>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
            disabled={isLoading}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
