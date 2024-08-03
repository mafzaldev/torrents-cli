import puppeteer from "puppeteer";

class PageSingleton {
  constructor() {
    if (PageSingleton.instance) {
      return PageSingleton.instance;
    }

    this.browser = null;
    this.page = null;

    PageSingleton.instance = this;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
    }

    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    return this.page;
  }

  async close() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

const instance = new PageSingleton();

export default instance;
