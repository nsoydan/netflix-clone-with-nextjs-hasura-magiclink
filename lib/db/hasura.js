export async function queryHasuragQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.HNEXT_PUBLIC_HASURA_URL, {
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_X_HASURA_ADMIN_SECRET,
    },
    method: "POST",

    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
