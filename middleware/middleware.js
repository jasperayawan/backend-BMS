

const csrfProtection = async (req, res, next) => {
    try{
        const sessionToken = req.headers['x-parse-session-token'];

        if (!sessionToken){
            res.status(404).json({ message: 'Unauthorized: no session token.' })
        }

        const query = new Parse.Query(Parse.Session);
        query.equalTo("sessionToken", sessionToken);
        const session = await query.first({ useMasterKey: true });

        if(!session){
            res.status(401).json({ message: "Unauthorized: Invalid session Token." })
        }

        const user = session.get("user");
        
        req.user = user;

        next();
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: "Internal server error." })
    }
}

module.exports = csrfProtection;