import { v4 as uuid } from "uuid";

type SignInRequestData = {
  email: string;
  password: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest({ email, password }: SignInRequestData) {
  await delay();

  return {
    token: uuid(),
    user: {
      name: "Matheus da Cruz",
      email: "matheuswachcruz@gmail.com",
      avatar_url: "https://github.com/mathwcruz.png",
    },
  };
}

export async function recoverUserInformation() {
  await delay();

  return {
    user: {
      name: "Matheus da Cruz",
      email: "matheuswachcruz@gmail.com",
      avatar_url: "https://github.com/mathwcruz.png",
    },
  };
}
