import { Request, Response } from '@vercel/node';

const API_ENDPOINT = 'https://cat-fact.herokuapp.com/facts';

export default async (request: Request, context: any): Promise<Response> => {
  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    return new Response(JSON.stringify({ data }), { status: response.status });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed fetching data' }), { status: 500 });
  }
};
