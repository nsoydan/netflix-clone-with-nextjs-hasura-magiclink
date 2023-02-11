export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer:String!,$email:String!,$publicAddress:String!) {
    insert_users(objects: {email: $email, issuer:$issuer, publicAddress:$publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
  `;

  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuragQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );
  console.log({ response });
  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer:String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer        
      }
    }
  `;

  const response = await queryHasuragQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );
  console.log({ response });
  return response?.data?.users?.length === 0 ? true : false;
}

export async function queryHasuragQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  console.log("***********");
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-tpye": "application/json",
    },
    method: "POST",

    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  const users = await result.json();
  return users;
}
