import { Iuser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<Iuser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });
  return user
};


const getAllUser = async() =>{
  const user = await User.find({})
  const totalUser = await User.countDocuments()
  return {
    data:user,
    meta:{
      total:totalUser
    }
  }
}

export const userServices = {
    createUser,
    getAllUser
}