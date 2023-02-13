import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
export default async function stats(req, res) {
  if (req.method === "POST") {
    console.log({ cookies: req.cookies });
    try {
      const videoId = req.query.videoId;
      const token = req.cookies.token;
      if (!req.cookies.token) {
        res.status(403).send({});
      } else {
        var decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log({ decodedToken });
        const userId = decodedToken.issuer;

        const doesStatsExit = await findVideoIdByUser(userId, videoId, token);

        if (doesStatsExit) {
          const updatedStats = await updateStats(token, {
            favourited: 55,
            userId,
            watched: true,
            videoId: "gxc6y2ZVfCU",
          });
          console.log({ updatedStats });
          res.send({ msg: "it works,  stats updated", updatedStats });
        } else {
          const insertedStats = await insertStats(token, {
            favourited,
            userId,
            watched,
            videoId,
          });
          console.log({ insertedStats });
          res.send({ msg: "it works, stats inserted", insertedStats });
        }
      }
    } catch (error) {
      console.log("Error occured /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
