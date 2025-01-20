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
        caption,
        profileUrl: `https://www.instagram.com/${username}`,
        username,
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
    await page.goto(link, { waitUntil: "networkidle2" });

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

export async function scrapePinterest(link: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto(link, { waitUntil: "networkidle2" });
    // Wait for the page to load the main container
    await page.waitForSelector("div[class='hs0 mQ8 ujU un8 C9i TB_']");
    // Extract required information
    const postDetails = await page.evaluate(() => {
      // Image
      const imageElement = document.querySelector(
        "img[class='hCL kVc L4E MIw N7A XiG']"
      );
      // class="hCL kVc L4E MIw N7A XiG"
      const imageUrl = imageElement?.getAttribute("src");
      const titleElement = document.querySelector(
        'h1[class="lH1 dyH iFc H2s GTB X8m zDA IZT CKL"]'
      );
      const title = titleElement?.textContent;
      const profileLinkElement = document.querySelector(
        'a[class="nrl _74 eEj kVc S9z NtY CCY"]'
      );
      const profileLink = profileLinkElement?.getAttribute("href");
      // Username
      const usernameElement = document.querySelector(
        "h1[class='X8m zDA IZT tBJ dyH iFc j1A swG']"
      );
      const username = usernameElement?.textContent;
      return {
        imageUrl,
        title,
        profileLink,
        username,
      };
    });
    console.log(postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error scraping Pinterest post:", error.message);
    return null;
  } finally {
    // Ensure the browser is closed
    await browser.close();
  }
}
