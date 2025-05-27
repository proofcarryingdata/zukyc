import _ from "lodash";
import { chance, getSSNByEmail } from "./shared";

export type DeelUser = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
  startDate: number;
  annualSalary: bigint;
  socialSecurityNumber: string;
};

export async function getDeelUserByEmail(
  email: string
): Promise<DeelUser | null> {
  // randomly generate DeelUser fields
  // In practice, look up the user in the database

  // const user = await podIssuerKV.hget<string>(email, "deelUser");
  // if (user !== null) {
  //   return jsonBigSerializer.parse(user);
  // }

  const names = email.replace(/@zoo.com$/, "").split(".");
  if (names.length < 2) {
    return null;
  }

  const startDate = chance.birthday({
    year: chance.year({ min: 2000, max: 2022 })
  }) as Date;
  const annualSalary = chance.integer({ min: 20000, max: 1000000 });
  const ssn = await getSSNByEmail(email);

  const deelUser = {
    email,
    firstName: _.upperFirst(names[0]),
    lastName: _.upperFirst(names[1]),
    startDate: startDate.getTime(),
    annualSalary: BigInt(annualSalary),
    socialSecurityNumber: ssn
  };
  // await podIssuerKV.hset(email, {
  //   deelUser: jsonBigSerializer.stringify(deelUser)
  // });
  return deelUser;
}
