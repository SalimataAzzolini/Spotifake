import { JwtPayload } from "jsonwebtoken";

interface AuthToken extends JwtPayload {
    id : string;
}

export { AuthToken };
