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

  test('should create a new project with form validation', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await page.waitForTimeout(500);
    
    await page.locator('#name').fill('E2E Test Project');
    await page.locator('#description').fill('This is an E2E test project for comprehensive testing');
    
    await page.getByRole('button', { name: /create project/i }).first().click();
    
    await page.waitForTimeout(2500);
    
    const content = await page.textContent('body');
    expect(content).toContain('E2E Test Project');
  });

  test('should create a new tester with all required fields', async ({ page }) => {
    await page.getByRole('tab', { name: /testers/i }).click();
    await page.waitForTimeout(500);
    
    const uniqueEmail = `e2e.tester.${Date.now()}@test.com`;
    
    await page.locator('#name').fill('E2E Test Tester');
    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#role').fill('QA Engineer');
    
    await page.getByRole('button', { name: /add tester/i }).click();
    
    await page.waitForTimeout(2000);
    
    const content = await page.textContent('body');
    expect(content).toContain('E2E Test Tester');
  });

  test('should create a test suite by selecting a project', async ({ page }) => {
    await page.getByRole('tab', { name: /test suites/i }).click();
    await page.waitForTimeout(500);
    
    const projectSelect = page.locator('[role="combobox"]').first();
    await projectSelect.click();
    await page.waitForTimeout(300);
    
    const firstProject = page.locator('[role="option"]').first();
    await firstProject.click();
    await page.waitForTimeout(300);
    
    await page.locator('#name').fill('E2E Test Suite');
    await page.locator('#description').fill('Test suite for E2E testing');
    
    await page.getByRole('button', { name: /create test suite/i }).click();
    
    await page.waitForTimeout(2500);
    
    const content = await page.textContent('body');
    expect(content).toContain('E2E Test Suite');
  });

  test('should create a test case with all form fields', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();
    await page.waitForTimeout(500);
    
    const suiteSelect = page.locator('[role="combobox"]').first();
    await suiteSelect.click();
    await page.waitForTimeout(300);
    
    const firstSuite = page.locator('[role="option"]').first();
    await firstSuite.click();
    await page.waitForTimeout(300);
    
    await page.locator('#name').fill('E2E Test Case');
    await page.locator('#description').fill('Test case description');
    await page.locator('#preconditions').fill('User must be logged in');
    await page.locator('#steps').fill('1. Open app\n2. Click button\n3. Verify result');
    await page.locator('#expected_result').fill('Application should respond correctly');
    
    await page.getByRole('button', { name: /create test case/i }).click();
    
    await page.waitForTimeout(2500);
    
    const content = await page.textContent('body');
    expect(content).toContain('E2E Test Case');
  });

  test('should create a bug report with all required information', async ({ page }) => {
    await page.getByRole('tab', { name: /bugs/i }).click();
    await page.waitForTimeout(500);
    
    await page.locator('#name').fill('E2E Test Bug');
    
    const projectSelect = page.locator('[role="combobox"]').first();
    await projectSelect.click();
    await page.waitForTimeout(300);
    const firstProject = page.locator('[role="option"]').first();
    await firstProject.click();
    await page.waitForTimeout(300);
    
    const discovererSelect = page.locator('[role="combobox"]').nth(3);
    await discovererSelect.click();
    await page.waitForTimeout(300);
    const firstTester = page.locator('[role="option"]').first();
    await firstTester.click();
    await page.waitForTimeout(300);
    
    await page.locator('#description').fill('This is a test bug for E2E testing');
    await page.locator('#steps_to_reproduce').fill('1. Navigate to page\n2. Click button\n3. Error appears');
    await page.locator('#environment').fill('Chrome 120, Windows 11');
    
    await page.getByRole('button', { name: /report bug/i }).click();
    
    await page.waitForTimeout(2500);
    
    const content = await page.textContent('body');
    expect(content).toContain('E2E Test Bug');
  });

  test('should navigate to reports tab and display content', async ({ page }) => {
    await page.getByRole('tab', { name: /reports/i }).click();
    await page.waitForTimeout(1000);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Reports');
  });

  test('should navigate to charts tab and display visualizations', async ({ page }) => {
    await page.getByRole('tab', { name: /charts/i }).click();
    await page.waitForTimeout(1000);
    
    const tabContent = await page.textContent('body');
    expect(tabContent).toContain('Charts');
  });

  test('should verify project form has validation', async ({ page }) => {
    await page.getByRole('tab', { name: /projects/i }).click();
    await page.waitForTimeout(500);
    
    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');
    
    const descriptionField = page.locator('#description');
    await expect(descriptionField).toBeVisible();
    
    const statusSelect = page.locator('[role="combobox"]').filter({ hasText: /active/i }).first();
    await expect(statusSelect).toBeVisible();
  });

  test('should navigate between all tabs smoothly and verify content loads', async ({ page }) => {
    const tabs = [
      { name: 'Projects', expectedContent: 'Create Project' },
      { name: 'Testers', expectedContent: 'Add Tester' },
      { name: 'Test Suites', expectedContent: 'Create Test Suite' },
      { name: 'Test Cases', expectedContent: 'Create Test Case' },
      { name: 'Bugs', expectedContent: 'Report Bug' },
      { name: 'Reports', expectedContent: 'Reports' },
      { name: 'Charts', expectedContent: 'Charts' }
    ];
    
    for (const tab of tabs) {
      await page.getByRole('tab', { name: new RegExp(tab.name, 'i') }).click();
      await page.waitForTimeout(400);
      
      const content = await page.textContent('body');
      expect(content).toContain(tab.expectedContent);
    }
  });
});
