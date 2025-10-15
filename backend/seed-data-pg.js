// PostgreSQL seed data - see POSTGRESQL_SETUP.md for usage
async function seedData(pool) {
  console.log('Starting PostgreSQL seeding...');
  try {
    const check = await pool.query('SELECT COUNT(*) FROM projects');
    if (parseInt(check.rows[0].count) > 0) {
      console.log('Data exists, skipping');
      return;
    }
    
    // Testers
    const t1 = await pool.query('INSERT INTO testers (name,email,role,date_joined) VALUES ($1,$2,$3,$4) RETURNING tester_id',['Alice Johnson','alice.johnson@test.com','Senior QA Engineer','2024-09-01']);
    const t2 = await pool.query('INSERT INTO testers (name,email,role,date_joined) VALUES ($1,$2,$3,$4) RETURNING tester_id',['Bob Smith','bob.smith@test.com','QA Engineer','2024-09-15']);
    const t3 = await pool.query('INSERT INTO testers (name,email,role,date_joined) VALUES ($1,$2,$3,$4) RETURNING tester_id',['Carol White','carol.white@test.com','Test Lead','2024-08-20']);
    const tids=[t1.rows[0].tester_id,t2.rows[0].tester_id,t3.rows[0].tester_id];
    console.log('Created 3 testers');
    
    // Projects
    const p1=await pool.query('INSERT INTO projects (name,description,start_date,end_date,status) VALUES ($1,$2,$3,$4,$5) RETURNING project_id',['E-Commerce Platform','Online shopping platform','2024-09-01','2025-03-01','Active']);
    const p2=await pool.query('INSERT INTO projects (name,description,start_date,end_date,status) VALUES ($1,$2,$3,$4,$5) RETURNING project_id',['Mobile Banking App','Banking application','2024-08-15','2025-02-15','Active']);
    const p3=await pool.query('INSERT INTO projects (name,description,start_date,end_date,status) VALUES ($1,$2,$3,$4,$5) RETURNING project_id',['CRM System','Customer management','2024-09-20','2025-04-20','Active']);
    const pids=[p1.rows[0].project_id,p2.rows[0].project_id,p3.rows[0].project_id];
    console.log('Created 3 projects');
    
    // Sub-projects (7 total)
    const sps=[];
    for(const [pid,n,d] of [[pids[0],'Payment Module','Payments'],[pids[0],'Shopping Cart','Cart'],[pids[0],'Authentication','Login'],[pids[1],'Transactions','Transfers'],[pids[1],'Account Mgmt','Accounts'],[pids[2],'Contacts','Contact DB'],[pids[2],'Sales','Pipeline']]){
      const r=await pool.query('INSERT INTO sub_projects (project_id,name,description) VALUES ($1,$2,$3) RETURNING sub_project_id',[pid,n,d]);
      sps.push(r.rows[0].sub_project_id);
    }
    console.log('Created 7 sub-projects');
    
    // Test suites (6 total)
    const tss=[];
    for(const [pid,n,d] of [[pids[0],'Payment Tests','Payments'],[pids[0],'Cart Tests','Cart'],[pids[0],'Auth Tests','Auth'],[pids[1],'Transaction Tests','Transfers'],[pids[1],'Security Tests','Security'],[pids[2],'CRM Tests','CRM']]){
      const r=await pool.query('INSERT INTO test_suites (project_id,name,description) VALUES ($1,$2,$3) RETURNING test_suite_id',[pid,n,d]);
      tss.push(r.rows[0].test_suite_id);
    }
    console.log('Created 6 test suites');
    
    // Test cases (23 total)
    const tcs=[];
    const cases=[
      [tss[0],'Credit Card Payment','High','Steps','Result'],[tss[0],'PayPal Payment','High','Steps','Result'],
      [tss[0],'Invalid Card','High','Steps','Result'],[tss[0],'Refund','Medium','Steps','Result'],
      [tss[1],'Add to Cart','High','Steps','Result'],[tss[1],'Remove Item','Medium','Steps','Result'],
      [tss[1],'Update Qty','Medium','Steps','Result'],[tss[1],'Discount','Medium','Steps','Result'],
      [tss[2],'Registration','High','Steps','Result'],[tss[2],'Login','High','Steps','Result'],
      [tss[2],'Password Reset','High','Steps','Result'],[tss[2],'Logout','Medium','Steps','Result'],
      [tss[3],'Transfer','High','Steps','Result'],[tss[3],'Bill Pay','High','Steps','Result'],
      [tss[3],'Schedule','Medium','Steps','Result'],[tss[4],'2FA','High','Steps','Result'],
      [tss[4],'Timeout','High','Steps','Result'],[tss[4],'Encryption','High','Steps','Result'],
      [tss[5],'Add Contact','High','Steps','Result'],[tss[5],'Update','Medium','Steps','Result'],
      [tss[5],'Delete','Low','Steps','Result'],[tss[5],'Search','Medium','Steps','Result'],
      [tss[5],'Export','Low','Steps','Result']
    ];
    for(const [sid,n,p,s,e] of cases){
      const r=await pool.query('INSERT INTO test_cases (test_suite_id,name,steps,expected_result,priority) VALUES ($1,$2,$3,$4,$5) RETURNING test_case_id',[sid,n,s,e,p]);
      tcs.push(r.rows[0].test_case_id);
    }
    console.log('Created 23 test cases');
    
    // Executions (40 total)
    const stats=['Pass','Fail','Pass','Pass','Blocked'];
    for(let i=0;i<40;i++){
      const d=new Date();d.setDate(d.getDate()-Math.floor(Math.random()*30));
      await pool.query('INSERT INTO test_executions (test_case_id,tester_id,status,execution_date,notes) VALUES ($1,$2,$3,$4,$5)',
        [tcs[Math.floor(Math.random()*tcs.length)],tids[Math.floor(Math.random()*tids.length)],stats[Math.floor(Math.random()*stats.length)],d,'Note']);
    }
    console.log('Created 40 executions');
    
    // Bugs (25 total)
    const bugs=[
      ['Payment fails','Critical','P1','Functional','Open'],['Cart wrong','High','P1','Functional','Fixed'],
      ['Login broken','Medium','P2','UI/UX','Assigned'],['Reset fails','High','P1','Functional','Reopened'],
      ['Cart disappears','High','P2','Functional','Open'],['Discount fails','Medium','P2','Functional','New'],
      ['Timeout short','Low','P3','Performance','Deferred'],['No confirm','Medium','P2','UI/UX','Fixed'],
      ['Bill fails','Critical','P1','Functional','Open'],['2FA broken','Critical','P1','Security','Retest'],
      ['Weak crypto','Critical','P1','Security','Fixed'],['No search','High','P2','Functional','Assigned'],
      ['Export crash','High','P2','Performance','Open'],['No confirm','Low','P3','UI/UX','New'],
      ['PayPal timeout','High','P1','Integration','Open'],['Slow refund','Medium','P3','Performance','New'],
      ['Glitchy','Low','P4','UI/UX','Closed'],['Weak valid','Medium','P2','Security','Verified'],
      ['Cache issue','Medium','P2','Security','Fixed'],['Page broken','Medium','P3','Functional','Assigned'],
      ['UI confusing','Low','P4','UI/UX','New'],['Overwrites','High','P2','Data','Open'],
      ['Crashes','Critical','P1','Functional','Reopened'],['Email slow','Low','P3','Performance','Closed'],
      ['Qty wrong','Medium','P3','Functional','New']
    ];
    for(const [n,sev,pri,typ,st] of bugs){
      const d=new Date();d.setDate(d.getDate()-Math.floor(Math.random()*30));
      const at=Math.random()>0.3?tids[Math.floor(Math.random()*tids.length)]:null;
      await pool.query('INSERT INTO bugs (project_id,sub_project_id,test_case_id,discovered_by,assigned_to,name,description,steps_to_reproduce,status,severity,priority,type,discovered_date,environment) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
        [pids[Math.floor(Math.random()*pids.length)],sps[Math.floor(Math.random()*sps.length)],tcs[Math.floor(Math.random()*tcs.length)],
         tids[Math.floor(Math.random()*tids.length)],at,n,'Description','Steps',st,sev,pri,typ,d,'Chrome']);
    }
    console.log('Created 25 bugs');
    console.log('✓ PostgreSQL seeding complete!');
  } catch(e){
    console.error('Seed error:',e);
    throw e;
  }
}
module.exports={seedData};
