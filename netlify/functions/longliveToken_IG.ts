import type { Context } from "@netlify/functions"

/**
 * Get Long live token from instagram
 * TODO: Remove maybe Explicit error messages on secrets like clientSecret is empty later
 */

export default async (req: Request, context: Context) => {
  try {
    /** Values From Request header */
    const shortLivedToken = req.headers.get("X-ACCESS-TOKEN") || "";

    /** Values From environement */
    const grantType: string = Netlify.env.get("IG_GRANT_TYPE") || "";
    const clientSecret: string = Netlify.env.get("IG_CLIENT_SECRET") || "";
    const url: string = Netlify.env.get("IG_LONG_LIVE_TOKEN_URL") || "";

    if (grantType === "") return new Response("Error: grantType is Empty");
    if (clientSecret === "") return new Response("Error: clientSecret is Empty");
    if (url === "") return new Response("Error: IG URL is Empty");
    if (shortLivedToken === "") return new Response("Error: Did not recieve short lived token for exchange");

    const params = new URLSearchParams();
    params.append('grant_type', grantType);
    params.append('client_secret', clientSecret)
    params.append('access_token', shortLivedToken);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    console.log("--------Request sent to: ", response.url);
    console.log("--------Request sent with parameters: ", params);
    console.log("--------Got Response as ", response);

    try {
      console.log("--------Trying to parse as JSON");
      const data = await response.json();
      return new Response(JSON.stringify(data));
    } catch {
      console.log("--------JSON parsing failed trying as text now");
      const data = await response.text();
      return new Response(data);
    }
  } catch (error) {
    console.error(error);
    return new Response(error);
  }

}


