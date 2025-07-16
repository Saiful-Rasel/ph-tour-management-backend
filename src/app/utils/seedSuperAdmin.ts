import bcrypt from "bcrypt";
import { IauthProvider, Iuser, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model";
import { envVar } from "../config/env";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVar.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("super admin already exist");
      return;
    }
    const authProvider: IauthProvider = {
      provider: "Credentials",
      providerId: envVar.SUPER_ADMIN_EMAIL as string,
    };

    const hashPassword = await bcrypt.hash(
      envVar.SUPER_ADMIN_PASSWORD as string,
      Number(envVar.BCRYPT_SALT_ROUND)
    );

    const payload: Iuser = {
      name: "super_admin",
      email: envVar.SUPER_ADMIN_EMAIL as string,
      role:Role.SUPER_ADMIN,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const createSuperAdmin = await User.create(payload)
  } catch (error) {
    console.log(error);
  }
};
