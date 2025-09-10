import { IUser } from "./user.interface";
import { User } from "./user.model";

// Partial<IUser> means some property of IUser not all
const createUser = async (payload: Partial<IUser>) => {
    const { name, email } = payload
    const user = await User.create({ name, email })
    return user
}

const getAllUsers = async () => {
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}

export const UserServices = {
    createUser,
    getAllUsers
}