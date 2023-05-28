import jwt from "jsonwebtoken";

export default (req, resp, next) => {
  // let token;
  // if (req.headers.authorization) {
  //   token = req.headers.authorization;


  //   try {
  //     const decoded = jwt.verify(token, "j#ghf#jdhsfk#33");
  //     req.userId = decoded._id;
  //     next();
  //   } catch (err) {
  //     console.log(err)
  //   }
  // } else {

  //   return resp.status(403).json({
  //     message: "немаэ доступу",
  //   });
  // }

  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'j#ghf#jdhsfk#33');

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};


