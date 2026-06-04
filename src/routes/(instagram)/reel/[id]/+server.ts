import type { RequestHandler } from "@sveltejs/kit";

function userIsInBrowser(userAgent: string | null): boolean {
  // Checks if the user is on mobile/desktop browser
  if (!userAgent) return false;
  const browserRegex = /Mozilla|Chrome|Safari|Firefox|Edge|Opera/i;
  return browserRegex.test(userAgent);
}

export const GET: RequestHandler = async ({ url, params, request }) => {
  const userAgent = request.headers.get("User-Agent");
  const reelUrl = "https://www.instagram.com/reel/" + (params.id ?? "0");

  const response = await fetch(`${url.origin}/reel/get-cdn-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url_media: reelUrl,
    }),
  });

  const responseJson = await response.json();
  const urlList = responseJson.url_list as string[];

  if (!userIsInBrowser(userAgent)) {
    if (response.status !== 200) {
      return new Response(await response.text(), { status: 404 });
    } else {
      return new Response(null, {
        status: 302,
        headers: {
          Location: urlList[0] ?? reelUrl,
        },
      });
    }
  } else {
    if (response.status !== 200) {
      // return 404 HTML page with button link to original Instagram reel
      return new Response(`
        <html>
          <head>
            <title>Reel Not Found</title>
          </head>
          <body>
            <h1>Reel Not Found</h1>
            <p>The reel you are looking for could not be found.</p>
            <a href="${reelUrl}" target="_blank">View on Instagram</a>
          </body>
        </html>
      `, { status: 404, headers: { "Content-Type": "text/html" } });
    } else {
      return new Response(`
        <html style="height: 100%; margin: 0;">
          <head>
            <title>Reel Viewer</title>
          </head>
          <body style="background-color: #1c1c1c; color: #ebebeb; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin: 0;">
            <h1>Viewing Reel: ${params.id}</h1>
            <video controls style="height: 75vh; max-width: 100%;">
              <source src="${urlList[0] ?? reelUrl}" type="video/mp4">
            </video>
            <br>
            <br>
            <a style="font-size: 24px;" href="${reelUrl}" target="_blank">View on Instagram</a>
          </body>
        </html>
      `, { status: 200, headers: { "Content-Type": "text/html" } });
    }
  }
};
