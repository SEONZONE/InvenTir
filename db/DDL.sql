
-- 데이터베이스 생성
-- CREATE DATABASE inventory_management;

-- 생성한 데이터베이스 사용
-- USE inventory_management;

-- 분류 코드 관리 생성

CREATE TABLE CATEGORY_CODE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL COMMENT 'process: 공정, product: 품명, unit: 단위',
    step1 VARCHAR(100),
    step2 VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    regi_name VARCHAR(50) NOT NULL,
    date_added DATE NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'Y' COMMENT 'Y: 사용, N: 미사용'
);

-- 자재 테이블
CREATE TABLE MATERIALS (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    process VARCHAR(100) ,
    product VARCHAR(100) ,
    scale VARCHAR(100),
    unit VARCHAR(100) ,
    quantity INT NOT NULL DEFAULT 0,
    material_unit_cost INT NOT NULL DEFAULT 0,
    labor_unit_cost INT NOT NULL DEFAULT 0,
    expenses_unit_cost INT NOT NULL DEFAULT 0,
    total_cost INT GENERATED ALWAYS AS (quantity * (material_unit_cost + labor_unit_cost + expenses_unit_cost)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 프로젝트 테이블
CREATE TABLE PROJECTS (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    client_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status ENUM('계획', '진행중', '완료', '보류') DEFAULT '계획',
    description TEXT,
    budget INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 프로젝트-자재 관계 테이블
CREATE TABLE PROJECT_MATERIALS (
    pm_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_price INT,  -- 프로젝트별 특별 단가가 있을 경우
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE RESTRICT
);

ALTER TABLE CATEGORY_CODE ADD COLUMN UNIT VARCHAR(50);

ALTER TABLE MATERIALS AUTO_INCREMENT = 100;


