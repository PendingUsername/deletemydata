import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { name, email, city, state } = req.body;

  const browser = await puppeteer.launch({ headless: false }); // show browser for CAPTCHA
  const page = await browser.newPage();

  const results: any[] = [];

  try {
    // SPOKEO
    await page.goto('https://www.spokeo.com/opt_out', { waitUntil: 'networkidle2' });

    await page.type('input[name="full_name"]', name);
    await page.type('input[name="email_address"]', email);
    await page.type('input[name="city"]', city);
    await page.type('input[name="state"]', state);

    // Don't submit — wait for user to solve CAPTCHA
    results.push({
      site: 'Spokeo',
      status: 'manual',   
      url: 'https://www.spokeo.com/opt_out',
    });
  } catch (error: any) {
    results.push({
      site: 'Spokeo',
      status: 'error',
      message: error.message,
    });
  }

  await browser.close();

  return res.status(200).json({ results });
}
