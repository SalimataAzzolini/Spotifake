import { IUser} from "./models/user.model";
declare namespace Express {
    interface Request {
      user?: IUser; 
    }
  }
