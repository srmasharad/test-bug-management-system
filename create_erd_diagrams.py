"""
Generate ERD diagrams for the Test Management System
"""

# Conceptual ERD - High level entities and relationships
conceptual_erd = """
@startuml Conceptual_ERD
!define ENTITY_COLOR #E3F2FD
!define RELATIONSHIP_COLOR #90CAF9

skinparam class {
    BackgroundColor ENTITY_COLOR
    BorderColor #1976D2
    ArrowColor RELATIONSHIP_COLOR
}

entity "Project" as project
entity "Sub-Project" as subproject  
entity "Tester" as tester
entity "Test Suite" as testsuite
entity "Test Case" as testcase
entity "Test Execution" as execution
entity "Bug/Issue" as bug

project ||--o{ subproject : "contains"
project ||--o{ testsuite : "has"
project ||--o{ bug : "tracks"
testsuite ||--o{ testcase : "groups"
testcase ||--o{ execution : "executed in"
testcase ||--o| bug : "linked to"
tester ||--o{ execution : "performs"
tester ||--o{ bug : "discovers"
tester ||--o{ bug : "assigned to"

@enduml
"""

# Logical ERD - Detailed with attributes
logical_erd = """
@startuml Logical_ERD
!define PRIMARY_KEY <u>
!define FOREIGN_KEY <i>

skinparam class {
    BackgroundColor #E8F5E9
    BorderColor #388E3C
}

entity "projects" {
    PRIMARY_KEY project_id : INTEGER
    --
    name : VARCHAR(255)
    description : TEXT
    start_date : DATE
    end_date : DATE
    status : VARCHAR(50)
    created_date : TIMESTAMP
}

entity "sub_projects" {
    PRIMARY_KEY sub_project_id : INTEGER
    --
    FOREIGN_KEY project_id : INTEGER
    name : VARCHAR(255)
    description : TEXT
}

entity "testers" {
    PRIMARY_KEY tester_id : INTEGER
    --
    name : VARCHAR(255)
    email : VARCHAR(255)
    role : VARCHAR(100)
    date_joined : DATE
}

entity "test_suites" {
    PRIMARY_KEY test_suite_id : INTEGER
    --
    FOREIGN_KEY project_id : INTEGER
    name : VARCHAR(255)
    description : TEXT
    created_date : TIMESTAMP
}

entity "test_cases" {
    PRIMARY_KEY test_case_id : INTEGER
    --
    FOREIGN_KEY test_suite_id : INTEGER
    name : VARCHAR(255)
    description : TEXT
    preconditions : TEXT
    steps : TEXT
    expected_result : TEXT
    priority : VARCHAR(50)
    created_date : TIMESTAMP
}

entity "test_executions" {
    PRIMARY_KEY execution_id : INTEGER
    --
    FOREIGN_KEY test_case_id : INTEGER
    FOREIGN_KEY tester_id : INTEGER
    status : VARCHAR(50)
    notes : TEXT
    execution_date : TIMESTAMP
}

entity "bugs" {
    PRIMARY_KEY bug_id : INTEGER
    --
    FOREIGN_KEY project_id : INTEGER
    FOREIGN_KEY sub_project_id : INTEGER
    FOREIGN_KEY test_case_id : INTEGER
    FOREIGN_KEY discovered_by : INTEGER
    FOREIGN_KEY assigned_to : INTEGER
    name : VARCHAR(255)
    description : TEXT
    steps_to_reproduce : TEXT
    status : VARCHAR(50)
    severity : VARCHAR(50)
    priority : VARCHAR(50)
    type : VARCHAR(50)
    environment : VARCHAR(255)
    discovered_date : TIMESTAMP
    assigned_date : TIMESTAMP
    resolution_date : TIMESTAMP
}

projects ||--o{ sub_projects
projects ||--o{ test_suites
projects ||--o{ bugs
test_suites ||--o{ test_cases
test_cases ||--o{ test_executions
test_cases ||--o| bugs
testers ||--o{ test_executions
testers ||--o{ bugs : "discovers"
testers ||--o{ bugs : "assigned"

@enduml
"""

print("ERD diagrams created successfully!")
print("\nSave these to .puml files and render with PlantUML")
