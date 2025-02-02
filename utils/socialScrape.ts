import axios from "axios";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import * as Pinterest from "@zanixongroup/pinterest-scraper";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { title } from "process";

// image container : _aagv
// caption container : xt0psk2
// use name container: x1i10hfl

export async function instaScrape(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto(link, { waitUntil: "networkidle2" });

    // Wait for the page to load the main container
    await page.waitForSelector("div[class='_aa6e']");

    // Extract required information
    const postDetails = await page.evaluate(() => {
      // Image
      const imageElement = document.querySelector(
        "img[class='x5yr21d xu96u03 x10l6tqk x13vifvy x87ps6o xh8yej3']"
      );
      const imageUrl = imageElement?.getAttribute("src");
      const altText = imageElement
        ?.getAttribute("alt")
        ?.replace(/[^a-zA-Z0-9]/g, " ");

      // Caption
      const captionElement = document.querySelector(
        "h1[class='_ap3a _aaco _aacu _aacx _aad7 _aade']"
      );
      const caption = captionElement?.textContent;

      // Username
      const usernameElement = document.querySelector(
        "a[class='x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x1f6kntn xwhw2v2 xl56j7k x17ydfre x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye xjbqb8w xm3z3ea x1x8b98j x131883w x16mih1h x972fbf xcfux6l x1qhh985 xm0m39n xt0psk2 xt7dq6l xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1n5bzlp xqnirrm xj34u2y x568u83']"
      );
      const username = usernameElement?.textContent;

      return {
        imageUrl,
        profileUrl: `https://www.instagram.com/${username}`,
        username,
        type: "Instagram",
        altText,
      };
    });

    console.log(postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error scraping Instagram post:", error.message);
    return null;
  } finally {
    // Ensure the browser is closed
    await browser.close();
  }
}

// class="_aa6a _aatb _aatd _aatf"

export async function scrapeDribble(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto(link, { waitUntil: "networkidle2" });

    // Wait for the page to load the main container
    await page.waitForSelector("div[class='shot-page-container']");

    // Extract required information
    const postDetails = await page.evaluate(() => {
      // Image
      const imageElement = document.querySelector(
        "img[class='v-img content-block border-radius-8']"
      );
      const imageUrl = imageElement?.getAttribute("src");

      // Username
      const usernameElement = document.querySelector(
        "div[class='sticky-header__name']"
      );
      const username = usernameElement?.textContent?.trim().replace(/\n/g, " ");

      const profileLinkElement = document.querySelector("a[class='user-name']");
      const profileLink = `https://dribbble.com/${profileLinkElement?.getAttribute(
        "href"
      )}`;

      return {
        imageUrl,
        profileLink,
        // caption,
        username,
        type: "Dribble",
      };
    });

    console.log(postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error scraping Instagram post:", error.message);
    return null;
  } finally {
    // Ensure the browser is closed
    await browser.close();
  }
}

export async function scrapeBehance(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto(link, { waitUntil: "domcontentloaded" });

    // Wait for the page to load the main container
    await page.waitForSelector("div[class='Project-main-oWL']");

    // Extract required information
    const postDetails = await page.evaluate(() => {
      // Image
      const imageElement = document.querySelector(
        "img[class='ImageElement-image-SRv']"
      );
      const imageUrl = imageElement?.getAttribute("src");

      const titleElement = document.querySelector(
        "h1[class='Project-title-Q6Q']"
      );

      const title = titleElement?.textContent;

      // Caption
      // const captionElement = document.querySelectorAll(
      //   "[data-v-7bc368fc][data-v-0ffb479a]"
      // )[0];
      // const caption = captionElement?.textContent?.trim();

      // Username
      // const usernameElement = document.querySelector(
      //   "div[class='sticky-header__name']"
      // );
      // const username = usernameElement?.textContent?.trim().replace(/\n/g, " ");

      // TODO: setup for video

      const profileLinkElement = document.querySelector(
        "a[class='Project-ownerName-A8O']"
      );
      const profileLink = profileLinkElement?.getAttribute("href");
      const profileName = profileLinkElement?.textContent;

      return {
        imageUrl,
        profileLink,
        title,
        profileName,
        type: "Behance",
        // caption,
        // username,
      };
    });

    // console.log(postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error scraping Behance post:", error.message);
    return null;
  } finally {
    // Ensure the browser is closed
    await browser.close();
  }
}

// export async function scrapePinterest(link: string) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     // Navigate to the link
//     await page.goto(link, { waitUntil: "domcontentloaded" });
//     // Wait for the page to load the main container
//     await page.waitForSelector("div[class='hs0 mQ8 ujU un8 C9i TB_']");
//     // Extract required information
//     const postDetails = await page.evaluate(() => {
//       // Image
//       const imageElement = document.querySelector(
//         "img[class='hCL kVc L4E MIw N7A XiG']"
//       );
//       // class="hCL kVc L4E MIw N7A XiG"
//       const imageUrl = imageElement?.getAttribute("src");
//       const titleElement = document.querySelector(
//         'h1[class="lH1 dyH iFc H2s GTB X8m zDA IZT CKL"]'
//       );
//       const title = titleElement?.textContent;
//       const profileLinkElement = document.querySelector(
//         'a[class="nrl _74 eEj kVc S9z NtY CCY"]'
//       );
//       const profileLink = profileLinkElement?.getAttribute("href");
//       // Username
//       const usernameElement = document.querySelector(
//         "h1[class='X8m zDA IZT tBJ dyH iFc j1A swG']"
//       );
//       const username = usernameElement?.textContent;
//       return {
//         imageUrl,
//         title,
//         profileLink,
//         username,
//       };
//     });
//     console.log(postDetails);
//     return postDetails;
//   } catch (error) {
//     console.error("Error scraping Pinterest post:", error.message);
//     return null;
//   } finally {
//     // Ensure the browser is closed
//     await browser.close();
//   }
// }

export async function scrapePinterest(pinUrl: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the Pinterest pin URL
    await page.goto(pinUrl, { waitUntil: "domcontentloaded" });

    // Wait for the necessary selectors to load
    await page.waitForSelector('img[src^="https://i.pinimg.com/"]'); // Image selector
    await page.waitForSelector('a[href^="/"]'); // Profile link selector
    await page.waitForSelector("h1"); // Username selector

    // Extract information
    const postDetails = await page.evaluate(() => {
      const imageElement = document.querySelector(
        'img[src^="https://i.pinimg.com/"]'
      );
      const imageUrl = imageElement ? imageElement.src : null;

      // console.log(profileLinkElement);

      const usernameElement = document.querySelector("h1");
      const title = usernameElement ? usernameElement.textContent : null;

      const accountNameElement = document.querySelector(
        'div[data-test-id="creator-profile-name"]'
      );
      const accountName = accountNameElement
        ? accountNameElement?.textContent.trim()
        : null;

      // const profileLinkElement = document.querySelector(
      //   'a[data-test-id="creator-profile-link"]'
      // );

      // const profileLinkElement = document.querySelector(
      //   'div[data-test-id="creator-profile-name"]'
      // );
      // console.log(profileLinkElement);

      // const profileLink = profileLinkElement
      //   ? `https://www.pinterest.com${profileLinkElement.getAttribute("href")}`
      //   : null;

      return { imageUrl, title, accountName, type: "Pinterest" };
    });

    console.log(postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error scraping Pinterest pin:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}

export async function scrapeReddtit(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the Pinterest pin URL
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the Reddit post
    await page.goto(link, { waitUntil: "networkidle0" });
    // await page.waitForSelector(
    //   "main[class='main w-full flex-[1] min-w-0 flex-grid--main-container-card right-sidebar-xs']"
    // ); // Username selector

    // Extract information
    const postData = await page.evaluate(() => {
      const titleElement = document.querySelector(
        "h1[class='font-semibold text-neutral-content-strong m-0 text-18 xs:text-24  mb-xs px-md xs:px-0 xs:mb-md  overflow-hidden']"
      );
      const title = titleElement?.textContent;
      const bodyElement = document.querySelector(
        "div[data-post-click-location='text-body']"
      );
      const body = bodyElement?.textContent;

      const subreddit = window.location.pathname.split("/")[2] || "";

      return { title, body, subreddit, type: "Reddit" };
    });

    console.log(postData);
    return postData;
  } catch (error) {
    console.error("Error scraping Pinterest pin:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}

export async function scrapeTwitter(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the Pinterest pin URL
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the Reddit post
    await page.goto(link, { waitUntil: "networkidle0" });

    // account name
    // text
    // image

    // Extract information
    const postData = await page.evaluate(() => {
      const contentElement = document.querySelector(
        "div[class='css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1inkyih r-16dba41 r-bnwqim r-135wba7']"
      );
      const content = contentElement?.textContent;

      const imageContainer = document.querySelector(
        "a[class='css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21']"
      );

      const imageElement = imageContainer?.querySelector(
        "img[class='css-9pa8cd']"
      );

      const image = imageElement?.getAttribute("src");

      const username = window.location.pathname.split("/")[1] || "";

      return { content, image: image || null, username, type: "Twitter" };
    });

    console.log(postData);
    return postData;
  } catch (error) {
    console.error("Error scraping Pinterest pin:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}

export async function scrapeArena(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the Pinterest pin URL
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the Reddit post
    await page.goto(link, { waitUntil: "networkidle0" });

    // account name
    // text
    // image

    // Extract information
    const postData = await page.evaluate(() => {
      const imageContainer = document.querySelector(
        "div[class='PJLV PJLV-ibquiLj-css']"
      );

      const imageElement = imageContainer?.querySelector("img");

      const image = imageElement?.getAttribute("src");
      const altText = imageElement?.getAttribute("alt");

      const userElement = document.querySelectorAll(
        'dd[class="c-lgwVNZ c-lgwVNZ-iepcqn-ellipsis-true c-lgwVNZ-gyaQWK-size-xs c-lgwVNZ-ideMeaq-css"]'
      );

      const user = userElement[2]?.textContent;

      const linkElement = userElement[2].querySelector("a");
      const userLink = linkElement?.getAttribute("href");

      return {
        image: image || null,
        user,
        altText,
        userLink: `https://www.are.na/${userLink}/channels`,
        type: "Arena",
      };
    });

    // console.log(postData);
    return postData;
  } catch (error) {
    console.error("Error scraping Pinterest pin:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}
