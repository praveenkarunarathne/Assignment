import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log("Navigating to http://localhost:4173/login");
  await page.goto('http://localhost:4173/login', { waitUntil: 'networkidle2' });

  // Wait for login form
  await page.waitForSelector('#login-username');
  console.log("Found login form.");

  // The hint says username is "emilys" and password is "emilyspass"
  await page.type('#login-username', 'emilys');
  await page.type('#login-password', 'emilyspass');
  await page.click('#login-submit');
  
  console.log("Clicked login, waiting for navigation...");
  
  // Wait for redirect to home page, we can wait for the nav bar to show the user avatar or "Shop"
  await page.waitForSelector('nav', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000)); // wait a bit for animation
  
  const currentUrl = page.url();
  console.log("Current URL after login:", currentUrl);
  if (currentUrl.includes('/login')) {
      console.error("Failed to login, still on login page.");
      process.exit(1);
  } else {
      console.log("Login successful! Redirected to", currentUrl);
  }
  
  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  console.log("Token in localStorage:", token);
  
  const userStr = await page.evaluate(() => localStorage.getItem('auth_user'));
  console.log("User in localStorage:", userStr);
  
  // Now verify sign out. The desktop signout button is an img inside a button with @click="handleSignOut".
  console.log("Looking for signout button...");
  
  // The sign out button has an img inside. We can look for the button containing the img.
  try {
    await page.waitForSelector('nav button img', { timeout: 10000 });
  } catch (err) {
    await page.screenshot({ path: 'screenshot.png' });
    const html = await page.content();
    require('fs').writeFileSync('page.html', html);
    console.error("Avatar button not found, took screenshot.png and page.html");
    throw err;
  }
  const avatarButton = await page.$('nav button img');
  if (avatarButton) {
      console.log("Found avatar button, clicking sign out...");
      // Click the parent button of the img
      await avatarButton.evaluate(b => b.closest('button').click());
  } else {
      console.error("Avatar button not found.");
      process.exit(1);
  }

  // Wait for redirect back to login
  await page.waitForSelector('#login-username', { timeout: 10000 });
  console.log("Successfully redirected back to login page.");
  
  console.log("Sign-in and sign-out logic is verified and working perfectly.");
  
  await browser.close();
})();
