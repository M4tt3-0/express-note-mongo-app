import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const jwtMiddleware = async (request, response, next) => {
    const { headers } = request;
    const authHeader = headers.authorization

    console.log(headers)
  
    if (authHeader !== '' && authHeader !== undefined) {
        const jwtToken = authHeader.split(' ').pop()

        try {

        const checkToken = jwt.verify(jwtToken, process.env.JWT_SECRET)
        const userExist = User.findOne({
            email: checkToken.email
        })

        if(userExist){
            next()
        } else {
            response.status(401).json({
                status: 'fail',
                code: 2001,
                error: 'User doesnt exist'
            })
        }
            
        } catch(err) {
            return response.status(401).json({
                status: 'fail',
                code: 2001,
                error: 'Unauthorized' + error.toString()
            })
        }
      
    } else
        response.status(401).json({
        status: 'fail',
        code: 2001,
        error: 'Unauthorized' + error.toString()
        })
  }
  export default jwtMiddleware;
  