import { test, expect } from '@playwright/test';

test.describe('Test Management System E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display main navigation tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /testers/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /test suites/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /test cases/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /bugs/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /reports/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /charts/i })).toBeVisible();
  });

  test('should create a new project', async ({ page }) => {
    await page.getByRole('button', { name: /projects/i }).click();
    
    await page.waitForSelector('input[placeholder*="project name" i]', { state: 'visible' });
    
    await page.fill('input[placeholder*="project name" i]', 'E2E Test Project');
    await page.fill('textarea[placeholder*="description" i]', 'This is an E2E test project');
    
    await page.getByRole('button', { name: /create project/i }).click();
    
    await page.waitForTimeout(1000);
    
    await expect(page.getByText('E2E Test Project')).toBeVisible();
  });

  test('should create a new tester', async ({ page }) => {
    await page.getByRole('button', { name: /testers/i }).click();
    
    await page.waitForSelector('input[placeholder*="name" i]', { state: 'visible' });
    
    await page.fill('input[placeholder*="name" i]', 'E2E Test Tester');
    await page.fill('input[type="email"]', 'e2e@test.com');
    
    await page.getByRole('button', { name: /add tester/i }).click();
    
    await page.waitForTimeout(1000);
    await expect(page.getByText('E2E Test Tester')).toBeVisible();
  });

  test('should navigate to and display test suites', async ({ page }) => {
    await page.getByRole('button', { name: /test suites/i }).click();
    
    await page.waitForSelector('text=Test Suites', { state: 'visible' });
    
    await expect(page.getByRole('button', { name: /create test suite/i })).toBeVisible();
  });

  test('should navigate to and display test cases', async ({ page }) => {
    await page.getByRole('button', { name: /test cases/i }).click();
    
    await page.waitForSelector('text=Test Cases', { state: 'visible' });
    
    await expect(page.getByRole('button', { name: /create test case/i })).toBeVisible();
  });

  test('should navigate to bugs tab and display bug form', async ({ page }) => {
    await page.getByRole('button', { name: /bugs/i }).click();
    
    await page.waitForSelector('text=Bugs', { state: 'visible' });
    
    await expect(page.getByRole('button', { name: /create bug/i })).toBeVisible();
  });

  test('should display reports tab with multiple reports', async ({ page }) => {
    await page.getByRole('button', { name: /reports/i }).click();
    
    await page.waitForSelector('text=Reports', { state: 'visible' });
    
    await expect(page.getByText(/report 1/i)).toBeVisible();
    await expect(page.getByText(/report 2/i)).toBeVisible();
  });

  test('should display charts tab with visualizations', async ({ page }) => {
    await page.getByRole('button', { name: /charts/i }).click();
    
    await page.waitForSelector('text=Charts', { state: 'visible' });
    
    await page.waitForTimeout(1000);
    
    const pageContent = await page.content();
    expect(pageContent).toContain('recharts');
  });

  test('should handle bug creation workflow', async ({ page }) => {
    await page.getByRole('button', { name: /projects/i }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: /bugs/i }).click();
    await page.waitForTimeout(500);
    
    const bugNameInput = page.locator('input[placeholder*="bug name" i]').first();
    if (await bugNameInput.isVisible()) {
      await bugNameInput.fill('E2E Test Bug');
      
      const submitButton = page.getByRole('button', { name: /create bug/i });
      if (await submitButton.isEnabled()) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should navigate between all tabs smoothly', async ({ page }) => {
    const tabs = ['Projects', 'Testers', 'Test Suites', 'Test Cases', 'Bugs', 'Reports', 'Charts'];
    
    for (const tab of tabs) {
      await page.getByRole('button', { name: new RegExp(tab, 'i') }).click();
      await page.waitForTimeout(300);
      
      await expect(page.getByText(tab, { exact: false })).toBeVisible();
    }
  });
});
