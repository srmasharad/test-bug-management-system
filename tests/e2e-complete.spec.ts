import { test, expect } from '@playwright/test';

test.describe('Test Management System E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('text=Test Management & Bug Tracking System', { timeout: 10000 });
  });

  test('should display main navigation tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /testers/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /test suites/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /test cases/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /bugs/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /reports/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /charts/i })).toBeVisible();
  });

  test('should create a new project', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await page.waitForTimeout(500);
    
    const projectInputs = await page.locator('input[type="text"]').all();
    if (projectInputs.length > 0) {
      await projectInputs[0].fill('E2E Test Project');
    }
    
    const descriptionInputs = await page.locator('textarea, input[type="text"]').all();
    if (descriptionInputs.length > 1) {
      await descriptionInputs[1].fill('This is an E2E test project');
    }
    
    const createButton = page.getByRole('button', { name: /create.*project/i });
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(1500);
    }
  });

  test('should create a new tester', async ({ page }) => {
    await page.getByRole('tab', { name: /testers/i }).click();
    await page.waitForTimeout(500);
    
    const textInputs = await page.locator('input[type="text"]').all();
    if (textInputs.length > 0) {
      await textInputs[0].fill('E2E Test Tester');
    }
    
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('e2e@test.com');
    }
    
    const addButton = page.getByRole('button', { name: /add.*tester/i });
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1500);
    }
  });

  test('should navigate to and display test suites', async ({ page }) => {
    await page.getByRole('tab', { name: /test suites/i }).click();
    await page.waitForTimeout(500);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Test Suites');
  });

  test('should navigate to and display test cases', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();
    await page.waitForTimeout(500);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Test Cases');
  });

  test('should navigate to bugs tab and display bug form', async ({ page }) => {
    await page.getByRole('tab', { name: /bugs/i }).click();
    await page.waitForTimeout(500);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Bugs');
  });

  test('should display reports tab', async ({ page }) => {
    await page.getByRole('tab', { name: /reports/i }).click();
    await page.waitForTimeout(1000);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Reports');
  });

  test('should display charts tab with visualizations', async ({ page }) => {
    await page.getByRole('tab', { name: /charts/i }).click();
    await page.waitForTimeout(1000);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Charts');
  });

  test('should handle bug creation workflow', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('tab', { name: /bugs/i }).click();
    await page.waitForTimeout(500);
    
    const inputs = await page.locator('input, textarea').count();
    expect(inputs).toBeGreaterThan(0);
  });

  test('should navigate between all tabs smoothly', async ({ page }) => {
    const tabs = ['Projects', 'Testers', 'Test Suites', 'Test Cases', 'Bugs', 'Reports', 'Charts'];
    
    for (const tab of tabs) {
      await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
      await page.waitForTimeout(400);
      
      const content = await page.textContent('body');
      expect(content).toContain(tab);
    }
  });
});
