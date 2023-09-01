import mongoose, { Model, Schema } from "mongoose";
import * as bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    resetToken?: string;
    tokenAccountCreation?: string;
    status: "pending" | "validated";
}

interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, unknown, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    tokenAccountCreation: String,
    status: {
        type: String,
        required: true,
    },
});

UserSchema.pre("save", async function (next: (err?: Error) => void) {
    const user = this as IUser;
    
    if (this.isModified("password") || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            next();
        } catch (err: unknown) {
            return next(err as Error);
        }
    } else {
        return next();
    }
});

UserSchema.pre("updateOne", async function (next: (err?: Error) => void) {
        
    const modifiedFields = this.getUpdate();

    if(modifiedFields && "password" in modifiedFields){
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(modifiedFields.password, salt);
            modifiedFields.password = hash;
            next();
        } catch (err: unknown) {
            return next(err as Error);
        }
    } else {
        return next();
    }
});

UserSchema.method("comparePassword", async function (
    password: string
): Promise<boolean> {
    try {
        const isMatching = await bcrypt.compare(password, this.password);
        return isMatching;
    } catch (err: unknown) {
        console.error(err);
        return false;
    }
});

export default mongoose.model<IUser, UserModel>("User", UserSchema);
