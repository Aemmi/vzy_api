const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWTSECRET;

const authorize = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	let token;

	if(authHeader.startsWith("Bearer ")){
		token = authHeader.slice(7);
	}else{
		token = authHeader;
	}

	if (!token) {
		return res.status(401).json({ message: "Missing access token" });
	}
	try {
		const payload = jwt.verify(token, SECRET_KEY);
		req.user = payload;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: "Access token expired" });
		}
		console.error("Error verifying access token:", error);
		res.status(401).json({ message: "Invalid access token" });
	}
};

module.exports = authorize;