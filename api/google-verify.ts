export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send('google-site-verification: googlebea468e8e5719358.html');
}
