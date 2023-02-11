import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "../../lib/db/hasura";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      console.log("Auth :", auth);

      const didToken = auth ? auth.substr(7) : "";
      console.log({ didToken });
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log("metadata from magic", metadata);

      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET
      );
      console.log({ token });

      // CHECK IF USER EXISTS

      const isNewUserQuery = await isNewUser(token, metadata.issuer);

      if (isNewUserQuery) {
        //create a user
        const createNewUserMutation = await createNewUser(token, metadata);
        console.log({ createNewUserMutation });
        res.send({ done: true, msg: "is a new user" });
      } else {
        res.send({ done: true, msg: "is not a new user" });
      }
    } catch (error) {
      console.log("something went wrong logging in :", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
