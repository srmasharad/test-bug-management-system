async function seedData(dbPool) {
  const db = dbPool;
  
  console.log('Starting data seeding...');
  
  try {
    const testers = [
      { name: 'Alice Johnson', email: 'alice.johnson@test.com', role: 'Senior QA Engineer', date_joined: '2024-09-01' },
      { name: 'Bob Smith', email: 'bob.smith@test.com', role: 'QA Engineer', date_joined: '2024-09-15' },
      { name: 'Carol White', email: 'carol.white@test.com', role: 'Test Lead', date_joined: '2024-08-20' }
    ];
    
    const testerIds = [];
    for (const tester of testers) {
      const [result] = await db.query(
        'INSERT INTO testers (name, email, role, date_joined) VALUES (?, ?, ?, ?)',
        [tester.name, tester.email, tester.role, tester.date_joined]
      );
      testerIds.push(result.insertId);
    }
    console.log(`Created ${testerIds.length} testers`);
    
    const projects = [
      { name: 'E-Commerce Platform', description: 'Online shopping platform with payment integration', start_date: '2024-09-01', end_date: '2025-03-01', status: 'Active' },
      { name: 'Mobile Banking App', description: 'iOS and Android banking application', start_date: '2024-08-15', end_date: '2025-02-15', status: 'Active' },
      { name: 'CRM System', description: 'Customer relationship management system', start_date: '2024-09-20', end_date: '2025-04-20', status: 'Active' }
    ];
    
    const projectIds = [];
    for (const project of projects) {
      const [result] = await db.query(
        'INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
        [project.name, project.description, project.start_date, project.end_date, project.status]
      );
      projectIds.push(result.insertId);
    }
    console.log(`Created ${projectIds.length} projects`);
    
    const subProjects = [
      { project_id: projectIds[0], name: 'Payment Module', description: 'Payment gateway integration' },
      { project_id: projectIds[0], name: 'Shopping Cart', description: 'Cart and checkout functionality' },
      { project_id: projectIds[0], name: 'User Authentication', description: 'Login and registration' },
      { project_id: projectIds[1], name: 'Transaction Processing', description: 'Money transfer and payments' },
      { project_id: projectIds[1], name: 'Account Management', description: 'Account details and settings' },
      { project_id: projectIds[2], name: 'Contact Management', description: 'Customer contact database' },
      { project_id: projectIds[2], name: 'Sales Pipeline', description: 'Lead and opportunity tracking' }
    ];
    
    const subProjectIds = [];
    for (const sp of subProjects) {
      const [result] = await db.query(
        'INSERT INTO sub_projects (project_id, name, description) VALUES (?, ?, ?)',
        [sp.project_id, sp.name, sp.description]
      );
      subProjectIds.push(result.insertId);
    }
    console.log(`Created ${subProjectIds.length} sub-projects`);
    
    const testSuites = [
      { project_id: projectIds[0], name: 'Payment Gateway Tests', description: 'Test payment processing' },
      { project_id: projectIds[0], name: 'Shopping Cart Tests', description: 'Test cart functionality' },
      { project_id: projectIds[0], name: 'Authentication Tests', description: 'Test login/registration' },
      { project_id: projectIds[1], name: 'Transaction Tests', description: 'Test money transfers' },
      { project_id: projectIds[1], name: 'Security Tests', description: 'Test security features' },
      { project_id: projectIds[2], name: 'CRM Functional Tests', description: 'Test core CRM features' }
    ];
    
    const testSuiteIds = [];
    for (const suite of testSuites) {
      const [result] = await db.query(
        'INSERT INTO test_suites (project_id, name, description) VALUES (?, ?, ?)',
        [suite.project_id, suite.name, suite.description]
      );
      testSuiteIds.push(result.insertId);
    }
    console.log(`Created ${testSuiteIds.length} test suites`);
    
    const testCases = [
      { suite_id: testSuiteIds[0], name: 'Process Credit Card Payment', priority: 'High', steps: '1. Add items to cart\n2. Proceed to checkout\n3. Enter credit card details\n4. Submit payment', expected: 'Payment processes successfully' },
      { suite_id: testSuiteIds[0], name: 'Process PayPal Payment', priority: 'High', steps: '1. Select PayPal option\n2. Login to PayPal\n3. Confirm payment', expected: 'Payment via PayPal succeeds' },
      { suite_id: testSuiteIds[0], name: 'Handle Invalid Card', priority: 'High', steps: '1. Enter invalid card number\n2. Submit payment', expected: 'Error message displayed' },
      { suite_id: testSuiteIds[0], name: 'Process Refund', priority: 'Medium', steps: '1. Navigate to order history\n2. Request refund\n3. Confirm', expected: 'Refund processed successfully' },
      
      { suite_id: testSuiteIds[1], name: 'Add Item to Cart', priority: 'High', steps: '1. Browse products\n2. Click Add to Cart\n3. Verify cart', expected: 'Item added to cart' },
      { suite_id: testSuiteIds[1], name: 'Remove Item from Cart', priority: 'Medium', steps: '1. View cart\n2. Click Remove\n3. Confirm', expected: 'Item removed from cart' },
      { suite_id: testSuiteIds[1], name: 'Update Item Quantity', priority: 'Medium', steps: '1. Change quantity in cart\n2. Update\n3. Verify total', expected: 'Quantity and total updated' },
      { suite_id: testSuiteIds[1], name: 'Apply Discount Code', priority: 'Medium', steps: '1. Enter discount code\n2. Apply\n3. Check total', expected: 'Discount applied correctly' },
      
      { suite_id: testSuiteIds[2], name: 'User Registration', priority: 'High', steps: '1. Click Register\n2. Fill form\n3. Submit', expected: 'Account created successfully' },
      { suite_id: testSuiteIds[2], name: 'User Login', priority: 'High', steps: '1. Enter credentials\n2. Click Login', expected: 'User logged in successfully' },
      { suite_id: testSuiteIds[2], name: 'Password Reset', priority: 'High', steps: '1. Click Forgot Password\n2. Enter email\n3. Follow reset link', expected: 'Password reset email sent' },
      { suite_id: testSuiteIds[2], name: 'Logout Functionality', priority: 'Medium', steps: '1. Click Logout\n2. Verify session ended', expected: 'User logged out' },
      
      { suite_id: testSuiteIds[3], name: 'Transfer Money Between Accounts', priority: 'High', steps: '1. Select accounts\n2. Enter amount\n3. Confirm transfer', expected: 'Money transferred successfully' },
      { suite_id: testSuiteIds[3], name: 'Pay Bills', priority: 'High', steps: '1. Select bill\n2. Enter amount\n3. Pay', expected: 'Bill payment successful' },
      { suite_id: testSuiteIds[3], name: 'Schedule Future Transfer', priority: 'Medium', steps: '1. Select schedule option\n2. Set date\n3. Confirm', expected: 'Transfer scheduled' },
      
      { suite_id: testSuiteIds[4], name: 'Two-Factor Authentication', priority: 'High', steps: '1. Enable 2FA\n2. Verify code\n3. Login with 2FA', expected: '2FA works correctly' },
      { suite_id: testSuiteIds[4], name: 'Session Timeout', priority: 'High', steps: '1. Login\n2. Wait for timeout\n3. Try action', expected: 'Session expires correctly' },
      { suite_id: testSuiteIds[4], name: 'Encryption Check', priority: 'High', steps: '1. Monitor traffic\n2. Verify encryption', expected: 'All data encrypted' },
      
      { suite_id: testSuiteIds[5], name: 'Add New Contact', priority: 'High', steps: '1. Click Add Contact\n2. Fill details\n3. Save', expected: 'Contact added successfully' },
      { suite_id: testSuiteIds[5], name: 'Update Contact Information', priority: 'Medium', steps: '1. Edit contact\n2. Update fields\n3. Save', expected: 'Contact updated' },
      { suite_id: testSuiteIds[5], name: 'Delete Contact', priority: 'Low', steps: '1. Select contact\n2. Delete\n3. Confirm', expected: 'Contact deleted' },
      { suite_id: testSuiteIds[5], name: 'Search Contacts', priority: 'Medium', steps: '1. Enter search term\n2. View results', expected: 'Relevant contacts shown' },
      { suite_id: testSuiteIds[5], name: 'Export Contacts', priority: 'Low', steps: '1. Select export\n2. Choose format\n3. Download', expected: 'Contacts exported successfully' }
    ];
    
    const testCaseIds = [];
    for (const tc of testCases) {
      const [result] = await db.query(
        'INSERT INTO test_cases (test_suite_id, name, steps, expected_result, priority) VALUES (?, ?, ?, ?, ?)',
        [tc.suite_id, tc.name, tc.steps, tc.expected, tc.priority]
      );
      testCaseIds.push(result.insertId);
    }
    console.log(`Created ${testCaseIds.length} test cases`);
    
    const executions = [];
    const statuses = ['Pass', 'Fail', 'Pass', 'Pass', 'Fail', 'Pass', 'Pass', 'Blocked', 'Pass', 'Pass'];
    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const testerId = testerIds[Math.floor(Math.random() * testerIds.length)];
      const testCaseId = testCaseIds[Math.floor(Math.random() * testCaseIds.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      await db.query(
        'INSERT INTO test_executions (test_case_id, tester_id, status, execution_date, notes) VALUES (?, ?, ?, ?, ?)',
        [testCaseId, testerId, status, date.toISOString(), status === 'Fail' ? 'Test failed, bug reported' : 'Test completed']
      );
    }
    console.log('Created 40 test executions');
    
    const bugTemplates = [
      { name: 'Payment fails with expired card', severity: 'Critical', priority: 'P1', type: 'Functional', status: 'Open' },
      { name: 'Cart total calculation incorrect', severity: 'High', priority: 'P1', type: 'Functional', status: 'Fixed' },
      { name: 'Login button not responsive on mobile', severity: 'Medium', priority: 'P2', type: 'UI/UX', status: 'Assigned' },
      { name: 'Password reset email not sent', severity: 'High', priority: 'P1', type: 'Functional', status: 'Reopened' },
      { name: 'Shopping cart item disappears', severity: 'High', priority: 'P2', type: 'Functional', status: 'Open' },
      { name: 'Discount code validation fails', severity: 'Medium', priority: 'P2', type: 'Functional', status: 'New' },
      { name: 'Session timeout too short', severity: 'Low', priority: 'P3', type: 'Performance', status: 'Deferred' },
      { name: 'Transfer confirmation missing', severity: 'Medium', priority: 'P2', type: 'UI/UX', status: 'Fixed' },
      { name: 'Bill payment fails for large amounts', severity: 'Critical', priority: 'P1', type: 'Functional', status: 'Open' },
      { name: '2FA code not working', severity: 'Critical', priority: 'P1', type: 'Security', status: 'Retest' },
      { name: 'Encryption weak on certain endpoints', severity: 'Critical', priority: 'P1', type: 'Security', status: 'Fixed' },
      { name: 'Contact search returns no results', severity: 'High', priority: 'P2', type: 'Functional', status: 'Assigned' },
      { name: 'Export feature crashes browser', severity: 'High', priority: 'P2', type: 'Performance', status: 'Open' },
      { name: 'Delete contact confirmation missing', severity: 'Low', priority: 'P3', type: 'UI/UX', status: 'New' },
      { name: 'PayPal integration timeout', severity: 'High', priority: 'P1', type: 'Integration', status: 'Open' },
      { name: 'Refund process takes too long', severity: 'Medium', priority: 'P3', type: 'Performance', status: 'New' },
      { name: 'Add to cart animation glitchy', severity: 'Low', priority: 'P4', type: 'UI/UX', status: 'Closed' },
      { name: 'Registration form validation weak', severity: 'Medium', priority: 'P2', type: 'Security', status: 'Verified' },
      { name: 'Logout doesn not clear cache', severity: 'Medium', priority: 'P2', type: 'Security', status: 'Fixed' },
      { name: 'Transaction history pagination broken', severity: 'Medium', priority: 'P3', type: 'Functional', status: 'Assigned' },
      { name: 'Schedule transfer UI confusing', severity: 'Low', priority: 'P4', type: 'UI/UX', status: 'New' },
      { name: 'Contact update overwrites fields', severity: 'High', priority: 'P2', type: 'Data', status: 'Open' },
      { name: 'Mobile app crashes on startup', severity: 'Critical', priority: 'P1', type: 'Functional', status: 'Reopened' },
      { name: 'Payment confirmation email delayed', severity: 'Low', priority: 'P3', type: 'Performance', status: 'Closed' },
      { name: 'Cart quantity limited incorrectly', severity: 'Medium', priority: 'P3', type: 'Functional', status: 'New' }
    ];
    
    for (let i = 0; i < bugTemplates.length; i++) {
      const bug = bugTemplates[i];
      const daysAgo = Math.floor(Math.random() * 30);
      const discoveredBy = testerIds[Math.floor(Math.random() * testerIds.length)];
      const assignedTo = Math.random() > 0.3 ? testerIds[Math.floor(Math.random() * testerIds.length)] : null;
      const subProjectId = subProjectIds[Math.floor(Math.random() * subProjectIds.length)];
      const testCaseId = Math.random() > 0.4 ? testCaseIds[Math.floor(Math.random() * testCaseIds.length)] : null;
      const subProject = subProjects.find(sp => sp.project_id === subProjectId);
      const projectId = subProjects.find(sp => subProjectIds.indexOf(sp) === subProjectIds.indexOf(subProjectId))?.project_id || projectIds[0];
      
      const discoveredDate = new Date();
      discoveredDate.setDate(discoveredDate.getDate() - daysAgo);
      
      let assignedDate = null;
      let resolutionDate = null;
      
      if (assignedTo) {
        assignedDate = new Date(discoveredDate);
        assignedDate.setDate(assignedDate.getDate() + Math.floor(Math.random() * 3));
      }
      
      if (bug.status === 'Closed' || bug.status === 'Verified') {
        resolutionDate = new Date(discoveredDate);
        resolutionDate.setDate(resolutionDate.getDate() + Math.floor(Math.random() * 10) + 5);
      }
      
      await db.query(
        `INSERT INTO bugs (project_id, sub_project_id, test_case_id, discovered_by, assigned_to,
         name, description, steps_to_reproduce, status, severity, priority, type, 
         discovered_date, assigned_date, resolution_date, environment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          subProjectId,
          testCaseId,
          discoveredBy,
          assignedTo,
          bug.name,
          `This is a detailed description of the bug: ${bug.name}. The issue occurs under specific conditions.`,
          '1. Navigate to the affected page\n2. Perform the action\n3. Observe the issue',
          bug.status,
          bug.severity,
          bug.priority,
          bug.type,
          discoveredDate.toISOString(),
          assignedDate?.toISOString(),
          resolutionDate?.toISOString(),
          'Windows 11, Chrome 120.0'
        ]
      );
    }
    console.log(`Created ${bugTemplates.length} bugs`);
    
    console.log('\n=== Data Seeding Complete ===');
    console.log(`Total Testers: ${testers.length}`);
    console.log(`Total Projects: ${projects.length}`);
    console.log(`Total Sub-Projects: ${subProjects.length}`);
    console.log(`Total Test Suites: ${testSuites.length}`);
    console.log(`Total Test Cases: ${testCases.length}`);
    console.log(`Total Test Executions: 40`);
    console.log(`Total Bugs: ${bugTemplates.length}`);
    console.log('Data spans approximately 30 days');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

module.exports = { seedData };
