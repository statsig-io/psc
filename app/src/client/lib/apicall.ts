export default async function apicall(
  command: string,
  args: Record<string, any> = {},
) {
  const url = `/api/${command}`;
  const body = JSON.stringify(args);
  const headers = {
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'POST',
    headers,
    body
  };
  const res = await fetch(url, options);
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }

  return json.data;
}