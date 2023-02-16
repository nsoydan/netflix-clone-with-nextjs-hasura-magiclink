import { removeTokenCookie } from "../../lib/cookies";
import { magicAdmin } from "../../lib/magic";

export default async function logout(req, res) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    removeTokenCookie(res);
    try {
      await magicAdmin.users.logoutByIssuer(userId);
    } catch (error) {
      console.error("Error : logging out magic user", error);
    }
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (error) {
    console.error("Something wrong with logout", error);
    res.send({ error });
  }
}
