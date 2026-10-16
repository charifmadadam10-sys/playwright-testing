# Playwright Testing (JavaScript)

เอกสารสรุปสำหรับอ่านทบทวน: เขียนเทสเว็บด้วย [Playwright](https://playwright.dev) ครอบคลุม 3 ไฟล์เทส

| ไฟล์ | เว็บที่ทดสอบ | จำนวนเทส |
|---|---|---|
| `example.spec.js` | https://playwright.dev | 2 |
| `practice-login.spec.js` | https://practicetestautomation.com/practice-test-login/ | 5 |
| `saucedemo.spec.js` | https://www.saucedemo.com | 3 |

---

## สารบัญ

1. [Playwright คืออะไร (เทียบกับ Cypress)](#1-playwright-คืออะไร-เทียบกับ-cypress)
2. [การติดตั้ง](#2-การติดตั้ง)
3. [โครงสร้างโปรเจกต์](#3-โครงสร้างโปรเจกต์)
4. [ตัวแปรและคำสั่งที่ต้องจำ](#4-ตัวแปรและคำสั่งที่ต้องจำ)
5. [ไฟล์ 1: example.spec.js](#5-ไฟล์-1-examplespecjs)
6. [ไฟล์ 2: practice-login.spec.js](#6-ไฟล์-2-practice-loginspecjs)
7. [ไฟล์ 3: saucedemo.spec.js](#7-ไฟล์-3-saucedemospecjs)
8. [คำสั่งรันเทสใน Terminal](#8-คำสั่งรันเทสใน-terminal)
9. [จุดที่ควรปรับปรุง](#9-จุดที่ควรปรับปรุง)
10. [โค้ดเวอร์ชันปรับปรุงแล้ว](#10-โค้ดเวอร์ชันปรับปรุงแล้ว)

---

## 1. Playwright คืออะไร (เทียบกับ Cypress)

Playwright เป็นเครื่องมือทดสอบเว็บของ Microsoft รองรับ 3 เอนจิน: **Chromium** (Chrome/Edge), **Firefox** และ **WebKit** (Safari)

| หัวข้อ | Cypress | Playwright |
|---|---|---|
| รูปแบบโค้ด | สั่งต่อกันเป็นสาย (`cy.get().click()`) | `async/await` ทุกคำสั่งต้องมี `await` |
| ตัวหลักที่ใช้ | `cy` | `page` |
| หาของ | `cy.get('selector')` | `page.locator()` / `page.getByRole()` ฯลฯ |
| ตรวจผล | `.should(...)` | `await expect(...).toXxx()` |
| รอ element | auto-retry | auto-wait (รอก่อนทำ action ให้เอง) |
| ไฟล์เทส | `*.cy.js` | `*.spec.js` |
| เบราว์เซอร์ | Chrome, Firefox, Edge | Chromium, Firefox, WebKit |
| เทสหลายแท็บ | ทำยาก | ทำได้ |
| ตัวบันทึกเทส | Cypress Studio | `codegen` (ดีมาก) |

---

## 2. การติดตั้ง

ต้องมี [Node.js](https://nodejs.org) ก่อน (ตรวจด้วย `node -v`)

```bash
mkdir playwright
cd playwright
npm init playwright@latest
```

ตัวติดตั้งจะถามคำถาม (ตอบตามนี้ก็ได้):

| คำถาม | คำตอบที่แนะนำ |
|---|---|
| JavaScript หรือ TypeScript | **JavaScript** (ตามโค้ดในเอกสารนี้) |
| โฟลเดอร์เทส | `tests` (ค่าเริ่มต้น) |
| เพิ่ม GitHub Actions | ไม่จำเป็น |
| ติดตั้งเบราว์เซอร์ | Yes |

ถ้าต้องติดตั้งเบราว์เซอร์ภายหลัง:

```bash
npx playwright install
```

---

## 3. โครงสร้างโปรเจกต์

```
playwright/
├── tests/
│   ├── example.spec.js            <- ตัวอย่างจาก playwright.dev
│   ├── practice-login.spec.js     <- Login practicetestautomation
│   └── saucedemo.spec.js          <- Login + Checkout SauceDemo
├── playwright.config.js           <- ไฟล์ตั้งค่า
├── package.json
├── playwright-report/             <- รายงาน HTML (สร้างอัตโนมัติ)
├── test-results/                  <- ผลการรัน, trace, screenshot ที่ fail (สร้างอัตโนมัติ)
└── README.md
```

> ไฟล์เทสต้องลงท้ายด้วย `.spec.js` (หรือ `.test.js`) และอยู่ในโฟลเดอร์ตาม `testDir` ในไฟล์ config

### ค่าเริ่มต้นของ `playwright.config.js` ที่ควรรู้

| ค่า | ความหมาย |
|---|---|
| `testDir: './tests'` | โฟลเดอร์ที่เก็บไฟล์เทส |
| `projects: chromium, firefox, webkit` | รันเทสกับ 3 เบราว์เซอร์ **ทุกเทสจะรัน 3 รอบ** |
| `fullyParallel: true` | เทสรันขนานกัน |
| `reporter: 'html'` | สร้างรายงาน HTML |
| headless (ค่าเริ่มต้น) | รันโดยไม่แสดงหน้าต่างเบราว์เซอร์ |

---

## 4. ตัวแปรและคำสั่งที่ต้องจำ

### โครงสร้างเทส

```javascript
import { test, expect } from '@playwright/test';

test('ชื่อเทส', async ({ page }) => {
  // โค้ดเทส
});
```

| ส่วน | ความหมาย |
|---|---|
| `import { test, expect }` | นำเข้าฟังก์ชันหลัก 2 ตัว ต้องมีทุกไฟล์ |
| `test('ชื่อ', fn)` | เทสเคส 1 อัน (เหมือน `it` ใน Cypress) |
| `async ({ page }) => {}` | ฟังก์ชันเทส ต้องเป็น `async` และรับ `page` |
| `page` | **ตัวแทนแท็บเบราว์เซอร์** (ตัวแปรสำคัญที่สุด) สร้างใหม่สะอาดให้ทุกเทส |
| `await` | รอให้คำสั่งเสร็จก่อนไปบรรทัดต่อไป **ห้ามลืม** ไม่งั้นเทสพังหรือผ่านมั่ว |
| `expect(...)` | ใช้ตรวจผล |

> `{ page }` คือ fixture ของ Playwright เทสแต่ละอันได้ browser context ใหม่ที่แยกกัน ไม่มี cookie/login ค้างจากเทสอื่น

### Action (สั่งให้ทำ)

| คำสั่ง | หน้าที่ |
|---|---|
| `await page.goto(url)` | เปิดเว็บ |
| `await locator.click()` | คลิก |
| `await locator.fill('text')` | ใส่ข้อความในช่อง (ล้างของเก่าก่อนให้เอง) |
| `await locator.check()` | ติ๊ก checkbox |
| `await locator.selectOption('x')` | เลือกใน dropdown |
| `await locator.press('Enter')` | กดปุ่มคีย์บอร์ด |
| `await locator.hover()` | เอาเมาส์ไปชี้ |
| `page.url()` | อ่าน URL ปัจจุบัน (ไม่ต้อง `await`) |

> `fill` ใช้แทน `type` ของ Cypress ได้เลย และเร็วกว่า การ `click()` ก่อน `fill()` แบบที่ codegen สร้างให้ไม่จำเป็น

### Locator (วิธีหา element) เรียงตามที่ Playwright แนะนำ

| คำสั่ง | หาจาก | ตัวอย่างในโค้ด |
|---|---|---|
| `page.getByRole('button', { name: 'Submit' })` | บทบาท + ชื่อที่แสดง | ปุ่ม Submit |
| `page.getByRole('textbox', { name: 'Username' })` | ช่องกรอกที่มี label | ช่อง Username |
| `page.getByRole('link', { name: 'Get started' })` | ลิงก์ | ลิงก์ Get started |
| `page.getByRole('heading', { name: 'Installation' })` | หัวข้อ h1-h6 | หัวข้อ Installation |
| `page.getByLabel('Username')` | ข้อความ label ของช่องกรอก | ช่อง Username |
| `page.getByText('...')` | ข้อความที่แสดง | |
| `page.getByPlaceholder('...')` | placeholder | |
| `page.getByTestId('x')` | attribute `data-testid` | |
| `page.locator('#username')` | CSS selector (id) | `#username`, `#submit`, `#error` |
| `page.locator('[data-test="..."]')` | CSS selector (attribute) | SauceDemo ทั้งหมด |

**หลักเลือก locator:** ใช้ `getByRole` / `getByLabel` ก่อน (ใกล้เคียงสิ่งที่ผู้ใช้เห็น) ถ้าไม่ได้ค่อยใช้ `locator()` ด้วย CSS

> SauceDemo ใช้ `data-test` ไม่ใช่ `data-testid` จึงใช้ `getByTestId` ตรงๆ ไม่ได้ แต่ตั้งค่าได้ใน `playwright.config.js`:
> ```javascript
> use: { testIdAttribute: 'data-test' }
> ```
> หลังตั้งค่าแล้วใช้ `page.getByTestId('username')` ได้เลย

### Assertion (ตรวจผล) ต้องมี `await` เสมอ

| คำสั่ง | ความหมาย |
|---|---|
| `await expect(page).toHaveTitle(/Playwright/)` | ชื่อแท็บ (title) ตรงกับ regex |
| `await expect(page).toHaveURL(url)` | URL ตรงกัน (รอและลองซ้ำให้) |
| `await expect(locator).toBeVisible()` | มองเห็น |
| `await expect(locator).toHaveText('x')` | ข้อความ **ตรงทั้งหมด** |
| `await expect(locator).toContainText('x')` | ข้อความ **มี x เป็นส่วนหนึ่ง** |
| `await expect(locator).toHaveCount(n)` | มี element n อัน |
| `await expect(locator).toHaveValue('x')` | ค่าในช่อง input |
| `await expect(locator).not.toBeVisible()` | **ไม่** เห็น |
| `expect(value).toBe(x)` | เทียบค่าธรรมดา (ไม่ใช่ web-first, ดูหัวข้อ 9) |

### Regex ใน `/Playwright/`

เครื่องหมาย `/.../` คือ regular expression `toHaveTitle(/Playwright/)` แปลว่า title ต้อง **มีคำว่า Playwright อยู่ข้างใน** (ไม่ต้องตรงทั้งหมด) ส่วน `'Playwright'` แบบ string ต้องตรงเป๊ะ

### Auto-wait (ไม่ต้องใช้ `wait`)

Playwright รอให้ element พร้อม (มีอยู่ มองเห็น คลิกได้) ก่อนทำ action ให้อัตโนมัติ และ `expect(locator)` จะลองซ้ำจนกว่าจะผ่านหรือหมดเวลา จึงไม่ต้องมี `waitForTimeout` แบบ `cy.wait`

### ข้อมูลทดสอบ

| เว็บ | Username | Password |
|---|---|---|
| practicetestautomation | `student` | `Password123` |
| SauceDemo | `standard_user` | `secret_sauce` |

| ข้อความ | ใช้ตรวจที่ |
|---|---|
| `Your username is invalid!` | `#error` (practice) |
| `Your password is invalid!` | `#error` (practice) |
| `Error: First Name is required` | `[data-test="error"]` (SauceDemo checkout) |
| `Thank you for your order!` | `[data-test="complete-header"]` |

---

## 5. ไฟล์ 1: example.spec.js

เทสตัวอย่างที่ Playwright สร้างให้ตอนติดตั้ง

```javascript
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

| บรรทัด | ความหมาย |
|---|---|
| `// @ts-check` | ให้ VS Code ตรวจชนิดข้อมูลในไฟล์ JS และช่วยเตือนข้อผิดพลาด ไม่มีผลตอนรันเทส |
| `import { test, expect }` | นำเข้าเครื่องมือหลัก |
| `page.goto(...)` | เปิดเว็บ |
| `toHaveTitle(/Playwright/)` | ชื่อแท็บมีคำว่า Playwright |
| `getByRole('link', { name: 'Get started' }).click()` | หาลิงก์ที่ชื่อ Get started แล้วคลิก |
| `getByRole('heading', { name: 'Installation' })` | หาหัวข้อ Installation ในหน้าใหม่ |
| `.toBeVisible()` | ยืนยันว่าเห็นหัวข้อนั้น = เปลี่ยนหน้าสำเร็จ |

---

## 6. ไฟล์ 2: practice-login.spec.js

Selector ของเว็บนี้: `#username`, `#password`, `#submit`, `#error`

```javascript
import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(page.url()).toBe('https://practicetestautomation.com/logged-in-successfully/');
})

test('login ID', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.locator('#username').fill('student');
  await page.locator('#password').fill('Password123');
  await page.locator('#submit').click();
  expect(page.url()).toBe('https://practicetestautomation.com/logged-in-successfully/');
})

test('codegen', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('student');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('Usernamefalse', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).fill('charif');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#error')).toHaveText('Your username is invalid!');
});

test('Passwordfalse', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).fill('student');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#error')).toHaveText('Your password is invalid!');
});
```

### อธิบายทีละเทส

| เทส | ทำอะไร | ผลที่คาดหวัง |
|---|---|---|
| `login` | หา element ด้วย **label** (`getByLabel`) และปุ่มด้วย **role** | URL เป็น `/logged-in-successfully/` |
| `login ID` | ทำเหมือนข้างบน แต่หาด้วย **id** (`locator('#...')`) | URL เป็น `/logged-in-successfully/` |
| `codegen` | โค้ดที่ได้จากการอัดเทส (บันทึกการคลิกของเรา) | **ไม่มี assertion** จึงผ่านเสมอถ้าไม่ error |
| `Usernamefalse` | username ผิด (`charif`) password ถูก | `#error` มีข้อความ `Your username is invalid!` |
| `Passwordfalse` | username ถูก password ผิด (`Password`) | `#error` มีข้อความ `Your password is invalid!` |

**เทส `login` กับ `login ID` เทียบกัน:** ทำสิ่งเดียวกันแต่ใช้ locator ต่างกัน เพื่อให้เห็นว่ามีหลายวิธีหา element (role/label ใกล้เคียงสิ่งที่ผู้ใช้เห็น, id เป็น CSS แบบดั้งเดิม)

**`expect(page.url()).toBe(...)`:** อ่าน URL ณ ตอนนั้นมาเทียบทันที ไม่มีการรอหรือลองซ้ำ (ดูหัวข้อ 9 วิธีที่ดีกว่า)

**`toHaveText` vs `toContainText`:** `toHaveText('Your username is invalid!')` ต้องตรงทั้งข้อความ ถ้าอยากตรวจแค่บางส่วนใช้ `toContainText`

---

## 7. ไฟล์ 3: saucedemo.spec.js

### Selector ที่ใช้ในไฟล์นี้

```javascript
'[data-test="username"]'                          // ช่อง username
'[data-test="password"]'                          // ช่อง password
'[data-test="login-button"]'                      // ปุ่ม Login
'[data-test="add-to-cart-sauce-labs-backpack"]'   // ปุ่มเพิ่ม Backpack
'[data-test="add-to-cart-sauce-labs-bike-light"]' // ปุ่มเพิ่ม Bike Light
'[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'  // ปุ่มเพิ่ม Bolt T-Shirt
'[data-test="add-to-cart-sauce-labs-fleece-jacket"]' // ปุ่มเพิ่ม Fleece Jacket
'[data-test="shopping-cart-link"]'                // ไอคอนตะกร้า
'[data-test="item-quantity"]'                     // จำนวนสินค้าในตะกร้า / Overview
'[data-test="checkout"]'                          // ปุ่ม Checkout
'[data-test="firstName"]'                         // ช่องชื่อ
'[data-test="lastName"]'                          // ช่องนามสกุล
'[data-test="postalCode"]'                        // ช่องรหัสไปรษณีย์
'[data-test="continue"]'                          // ปุ่ม Continue
'[data-test="error"]'                             // กล่อง error
'[data-test="finish"]'                            // ปุ่ม Finish
'[data-test="complete-header"]'                   // หัวข้อ "Thank you for your order!"
```

### โค้ด

```javascript
import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
})

test('verify item quantity', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');

  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

  await page.locator('[data-test="firstName"]').fill('charif');
  await page.locator('[data-test="lastName"]').fill('madadam');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');

  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});

test('test total amount', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('charif');
  await page.locator('[data-test="lastName"]').fill('madadam');
  await page.locator('[data-test="postalCode"]').fill('6610210575');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="complete-header"]').click();
});
```

(ตัดบล็อกที่ถูกคอมเมนต์ไว้ และ `.click()` ก่อน `.fill()` ที่ codegen สร้างเกินมาออกจากตัวอย่างนี้แล้ว)

### เทส `login`

หา element ด้วย role (`textbox` + ชื่อ, `button` + ชื่อ) แล้วตรวจว่า URL เป็น `/inventory.html` = login สำเร็จ

### เทส `verify item quantity`

เทสยาวหนึ่งเส้น ผ่าน flow ทั้งหมด ตรวจหลายจุดระหว่างทาง:

| ขั้นตอน | โค้ด | ตรวจอะไร |
|---|---|---|
| 1 | login | |
| 2 | เพิ่ม Backpack แล้วเข้าตะกร้า | `item-quantity` เป็น `1` |
| 3 | กด Checkout แล้วกด Continue **โดยไม่กรอกอะไร** | ขึ้น error `Error: First Name is required` (**ทดสอบ validation**) |
| 4 | กรอกชื่อ นามสกุล รหัสไปรษณีย์ แล้ว Continue | หน้า Overview จำนวนยังเป็น `1` |
| 5 | กด Finish | `complete-header` เป็น `Thank you for your order!` |

จุดเด่นคือ **ทดสอบทั้ง negative case (ไม่กรอกข้อมูล) และ happy path ในเทสเดียว** แต่ถ้าขั้นต้นพัง ขั้นหลังจะไม่ได้ถูกตรวจ

### เทส `test total amount`

เพิ่มสินค้า 4 ชิ้น (Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket) แล้ว checkout จนจบ

> **ข้อสังเกต**: ชื่อเทสบอกว่า "ตรวจยอดรวม" แต่โค้ด **ไม่มี assertion ตรวจยอดเลย** บรรทัดสุดท้ายแค่ `.click()` ที่ `complete-header` ซึ่งเป็นการคลิก ไม่ใช่การตรวจ เทสนี้จึงผ่านได้แม้ยอดรวมผิด ดูวิธีแก้ในหัวข้อ 10

---

## 8. คำสั่งรันเทสใน Terminal

### คำสั่งหลัก

```bash
# รันทุกเทส (headless, ทุกเบราว์เซอร์ใน config)
npx playwright test

# รันเฉพาะไฟล์
npx playwright test tests/practice-login.spec.js
npx playwright test saucedemo

# รันเฉพาะเทสที่ชื่อตรง (grep)
npx playwright test -g "Usernamefalse"
npx playwright test -g "login"

# รันเฉพาะบรรทัดของเทส
npx playwright test tests/saucedemo.spec.js:3
```

### เลือกเบราว์เซอร์

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

> ถ้าไม่ใส่ `--project` จะรันทุกเทส 3 รอบ (3 เบราว์เซอร์) ตอนเรียนรู้ใช้ `--project=chromium` จะเร็วกว่ามาก

### ดูการทำงาน / debug

```bash
# เห็นหน้าต่างเบราว์เซอร์ตอนรัน
npx playwright test --headed

# เปิดโหมด UI (เลือกรัน ดูทีละขั้น ย้อนดูได้) แนะนำสำหรับเรียนรู้
npx playwright test --ui

# Debug ทีละบรรทัดด้วย Playwright Inspector
npx playwright test --debug
npx playwright test tests/saucedemo.spec.js --debug
```

### รายงานและ trace

```bash
# เปิดรายงาน HTML ล่าสุด
npx playwright show-report

# บันทึก trace ทุกเทส แล้วเปิดดู
npx playwright test --trace on
npx playwright show-trace test-results/<โฟลเดอร์>/trace.zip
```

### ควบคุมการรัน

```bash
npx playwright test --workers=1          # รันทีละเทส (ไม่ขนาน)
npx playwright test --retries=2          # ลองรันซ้ำ 2 ครั้งถ้า fail
npx playwright test --repeat-each=5      # รันแต่ละเทส 5 รอบ (หาเทสที่ไม่เสถียร)
npx playwright test --last-failed        # รันเฉพาะเทสที่ fail ครั้งก่อน
npx playwright test --list               # แค่แสดงรายชื่อเทส ไม่รัน
npx playwright test --reporter=list      # แสดงผลเป็นรายการใน terminal
```

### Codegen (อัดเทสจากการคลิกจริง)

```bash
npx playwright codegen https://www.saucedemo.com
```

จะเปิดเบราว์เซอร์กับหน้าต่าง Inspector ที่สร้างโค้ดให้ตามที่เราคลิก/พิมพ์ (เทส `codegen` และบล็อกที่ถูกคอมเมนต์ในไฟล์ SauceDemo มาจากวิธีนี้) ก๊อปโค้ดไปวางแล้ว **เติม assertion เอง**

### อื่นๆ

```bash
npx playwright install                   # ติดตั้งเบราว์เซอร์
npx playwright --version                 # ดูเวอร์ชัน
```

### สรุปคำสั่ง

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npx playwright test` | รันทุกเทส |
| `npx playwright test ไฟล์` | รันเฉพาะไฟล์ |
| `npx playwright test -g "ชื่อ"` | รันเฉพาะเทสที่ชื่อตรง |
| `--project=chromium` | เลือกเบราว์เซอร์ |
| `--headed` | เห็นหน้าต่างเบราว์เซอร์ |
| `--ui` | โหมด UI สำหรับรันและดูทีละขั้น |
| `--debug` | Debug ด้วย Inspector |
| `npx playwright show-report` | เปิดรายงาน HTML |
| `npx playwright codegen URL` | อัดเทสจากการคลิก |
| `npx playwright install` | ติดตั้งเบราว์เซอร์ |

### ตั้งทางลัดใน package.json

```json
{
  "scripts": {
    "test": "playwright test",
    "test:chrome": "playwright test --project=chromium",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed --project=chromium",
    "report": "playwright show-report",
    "codegen": "playwright codegen"
  }
}
```

```bash
npm test
npm run test:ui
npm run report
```

---

## 9. จุดที่ควรปรับปรุง

| ปัญหาในโค้ดเดิม | วิธีแก้ |
|---|---|
| `expect(page.url()).toBe(...)` อ่าน URL ทันที ไม่รอ ไม่ลองซ้ำ อาจ fail ถ้าหน้ายังเปลี่ยนไม่ทัน | ใช้ `await expect(page).toHaveURL(...)` (รอและลองซ้ำให้) |
| เทส `codegen` ไม่มี assertion | เติม `await expect(page).toHaveURL(...)` หรือลบเทสที่ซ้ำกับ `login` |
| เทส `test total amount` ไม่ตรวจยอดรวมเลย | เพิ่ม `await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $105.96')` ก่อนกด Finish |
| `.click()` ก่อน `.fill()` (จาก codegen) | ลบ `.click()` ออก `fill` ทำให้เองอยู่แล้ว |
| `page.goto` และ login ซ้ำทุกเทส | ใช้ `test.beforeEach` หรือฟังก์ชัน helper |
| URL เว็บซ้ำหลายที่ | ตั้ง `baseURL` ใน `playwright.config.js` แล้วใช้ `page.goto('/')` |
| ข้อมูลทดสอบฝังในโค้ด | แยกเป็นตัวแปร/ไฟล์ข้อมูล |
| เทส `verify item quantity` ยาวและทำหลายอย่าง | แยกเป็นเทสเล็กๆ หนึ่งเรื่องต่อหนึ่งเทส (validation, happy path) |
| ชื่อเทสไม่สื่อความหมาย (`codegen`, `Usernamefalse`) | ตั้งชื่อบอกสิ่งที่ตรวจ เช่น `shows error when username is invalid` |
| ไม่ได้จัดกลุ่มเทส | ใช้ `test.describe('...', () => {})` |
| ลืม `await` | ใส่ `await` ทุก action และทุก `expect(locator)` |
| ราคาสินค้าที่ใช้ตรวจอาจเปลี่ยนตามเว็บ | ตรวจราคาจริงบนหน้าเว็บอีกครั้งก่อนใส่ในเทส |

---

## 10. โค้ดเวอร์ชันปรับปรุงแล้ว

### `playwright.config.js` (ส่วนที่ปรับ)

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    testIdAttribute: 'data-test',   // ให้ getByTestId ใช้กับ SauceDemo ได้
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

> ตัวอย่างนี้เหลือแค่ chromium เพื่อให้รันเร็วตอนเรียนรู้ ถ้าต้องการ firefox/webkit ให้เพิ่มกลับ

### `tests/practice-login.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Practice Test Automation - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  async function login(page, username, password) {
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Submit' }).click();
  }

  test('login success with valid credentials', async ({ page }) => {
    await login(page, 'student', 'Password123');
    await expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');
  });

  test('shows error when username is invalid', async ({ page }) => {
    await login(page, 'charif', 'Password123');
    await expect(page.locator('#error')).toHaveText('Your username is invalid!');
  });

  test('shows error when password is invalid', async ({ page }) => {
    await login(page, 'student', 'Password');
    await expect(page.locator('#error')).toHaveText('Your password is invalid!');
  });
});
```

### `tests/saucedemo.spec.js`

```javascript
import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

async function fillCheckoutInfo(page) {
  await page.locator('[data-test="firstName"]').fill('charif');
  await page.locator('[data-test="lastName"]').fill('madadam');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
}

test.describe('SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('cart shows quantity 1 after adding one item', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
  });

  test('checkout requires first name', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
  });

  test('complete checkout with one item', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInfo(page);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('item total equals sum of 4 item prices', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();      // 29.99
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();    //  9.99
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();  // 15.99
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click(); // 49.99
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInfo(page);

    // 29.99 + 9.99 + 15.99 + 49.99 = 105.96
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $105.96');

    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
```

### เปลี่ยนแปลงที่ทำ

| ที่เปลี่ยน | เหตุผล |
|---|---|
| `toHaveURL` แทน `expect(page.url()).toBe` | รอและลองซ้ำให้ ไม่ flaky |
| `test.describe` + `test.beforeEach` | จัดกลุ่ม และไม่เขียน goto/login ซ้ำ |
| ฟังก์ชัน `login` / `fillCheckoutInfo` | ใช้ซ้ำ แก้ที่เดียว |
| แยกเทสยาวเป็นเทสเล็ก | fail แล้วรู้ทันทีว่าพังตรงไหน |
| เทสสุดท้ายตรวจ `subtotal-label` จริง | แก้เทส `test total amount` ที่ไม่ได้ตรวจยอด |
| ลบเทส `codegen` ที่ซ้ำและไม่มี assertion | ไม่ได้ตรวจอะไรเพิ่ม |
| ตั้งชื่อเทสให้สื่อความหมาย | อ่านรายงานแล้วเข้าใจทันที |

---

## ทิปเวลาเทส Fail

1. รัน `npx playwright show-report` ดูรายงาน มี screenshot และ error ของเทสที่ fail
2. รัน `npx playwright test --ui` ดูทีละขั้น ย้อนกลับได้ และเห็น locator ที่ใช้
3. รัน `npx playwright test --debug` ให้หยุดทีละบรรทัด
4. ใช้ `npx playwright codegen URL` ช่วยหา locator ที่ถูกต้อง
5. เช็คว่าใส่ `await` ครบทุกบรรทัด (สาเหตุที่พบบ่อยที่สุด)
6. ถ้า fail เป็นบางครั้ง ลอง `--repeat-each=10` เพื่อดูว่าเทสเสถียรไหม

---

## ตารางเทียบ Cypress กับ Playwright (คำสั่งที่ใช้บ่อย)

| งาน | Cypress | Playwright |
|---|---|---|
| เปิดเว็บ | `cy.visit(url)` | `await page.goto(url)` |
| พิมพ์ | `cy.get('#u').type('x')` | `await page.locator('#u').fill('x')` |
| คลิก | `cy.get('#b').click()` | `await page.locator('#b').click()` |
| มองเห็น | `.should('be.visible')` | `await expect(loc).toBeVisible()` |
| ข้อความตรง | `.should('have.text', 'x')` | `await expect(loc).toHaveText('x')` |
| ข้อความมีบางส่วน | `.should('contain', 'x')` | `await expect(loc).toContainText('x')` |
| ตรวจ URL | `cy.url().should('include', 'x')` | `await expect(page).toHaveURL(/x/)` |
| ก่อนทุกเทส | `beforeEach(() => {})` | `test.beforeEach(async ({ page }) => {})` |
| จัดกลุ่ม | `describe(...)` | `test.describe(...)` |
| รันเฉพาะเทสนี้ | `it.only(...)` | `test.only(...)` |
| ข้ามเทส | `it.skip(...)` | `test.skip(...)` |
| เปิดแบบมี UI | `npx cypress open` | `npx playwright test --ui` |
| รันแบบ headless | `npx cypress run` | `npx playwright test` |
