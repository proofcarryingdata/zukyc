import _ from "lodash";
import { podIssuerKV, chance, getSSNByEmail } from "./shared";

export type GovUser = {
  email: string;
  // hashedpassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  idNumber: string;
  socialSecurityNumber: string;
};

export async function getGovUserByEmail(
  email: string
): Promise<GovUser | null> {
  // randomly generate GovUser fields
  // In practice, look up the user in the database
  const names = email.replace(/@zoo.com$/, "").split(".");
  if (names.length < 2) {
    return null;
  }

  const dateOfBirth = chance.birthday({
    year: chance.year({ min: 1970, max: 2005 })
  }) as Date;
  const idNumber = chance.string({ pool: "0123456789", length: 7 });
  const ssn = await getSSNByEmail(email);

  return {
    email,
    firstName: _.upperFirst(names[0]),
    lastName: _.upperFirst(names[1]),
    dateOfBirth: dateOfBirth.getTime(),
    idNumber: `G${idNumber}`,
    socialSecurityNumber: ssn
  };
}

export async function getIDPODByEmail(email: string): Promise<string | null> {
  return await podIssuerKV.hget<string>(email, "idPOD");
}

export async function saveIDPOD(email: string, serializedPOD: string) {
  await podIssuerKV.hset(email, { idPOD: serializedPOD });
}
