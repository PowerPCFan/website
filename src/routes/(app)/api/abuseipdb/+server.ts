import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    const response = await fetch(`https://abuseipdb.com/contributor/${id}.svg?theme=dark&cachebuster=${Date.now()}`);
    const svgText = await response.text();
    const match = svgText.match(/([\d,]+)\s*IPs\s*Reported/m);
    const count = match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
    return json({ count });
}
