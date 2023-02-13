import jwt from "jsonwebtoken";

export default async function stats(req, res) {
  if (req.method === "POST") {
    console.log({ cookies: req.cookies });
    try {
      const token = req.cookies.token;
      if (!req.cookies.token) {
        res.status(403).send({});
      } else {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({ decoded });
        res.send({ msg: "it works", decoded });
      }
    } catch (error) {
      console.log("Error occured /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
