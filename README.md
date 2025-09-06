# NextJs 를 활용한 자재 관리 시스템 (InvenTir)

## 프로젝트 기간

2025.06 ~ 진행중
## 프로젝트 개요

안녕하세요! 이 프로젝트는 Next.js를 기반으로 한 자재 관리 시스템입니다. 
사용자는 프로젝트, 공정, 품명 등을 관리하고 각 프로젝트에 필요한 자재의 비용을 추정할 수 있습니다.

추후 아래의 기술을 추가하려고 합니다. 
- 엑셀 업로드, 다운로드 기능 
- 로그인 기능 
- 댓글 기능 
- 이전 자재 데이터를 활용한 자재금액 추천 기능 
- 대시보드

## 기술스택

### Frontend
- **Framework**: Next.js (v15.3.0) / React (v19.0.0)
- **Styling**: Tailwind CSS, Material Tailwind

### Backend
- **Framework**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)


### 개발 환경
- **Package Manager**: npm
- **Build Tool**: Next.js CLI (`next build`)


## 주요 기능

- **프로젝트 관리**: 신규 프로젝트를 등록하고, 기존 프로젝트의 정보를 수정 및 조회합니다.
- **분류 코드 관리**: 공정, 품명, 단위 등 자재 관리에 필요한 분류 코드를 생성하고 관리합니다.
- **자재 비용 산출**: 각 프로젝트별로 필요한 자재의 수량과 단가를 입력하여 재료비, 노무비, 경비 등을 포함한 총 원가를 계산합니다.
- **API 연동**: Next.js의 API 라우트를 통해 데이터베이스와 통신하여 데이터를 관리합니다.

## 데이터베이스 구조

주요 테이블은 다음과 같습니다.

- `CATEGORY_CODE`: 공정, 품명, 단위 등 분류 코드를 관리하는 테이블
- `PROJECTS`: 프로젝트 정보를 저장하는 테이블
- `PROJECT_MATERIALS`: 각 프로젝트에 어떤 자재가 얼마나 사용되는지를 저장하는 관계 테이블

(자세한 내용은 `db/DDL.sql` 또는 `ddl.sql` 파일 참조)

## 시작하기

1.  **저장소 복제**
    ```bash
    git clone <repository-url>
    cd article
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **.env 파일 설정**
    Supabase 접속을 위한 환경 변수를 설정해야 합니다.
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ``` 


## Git 컨벤션

| Feat            | 새로운 기능을 추가한 경우                              |
| --------------- | ------------------------------------------- |
| Fix             | 에러를 수정한 경우                                  |
| Design          | CSS 등 UI 디자인을 변경한 경우                        |
| BREAKING CHANGE | 중대한 API를 변경한 경우                             |
| HOTFIX          | 급하게 치명적인 에러를 고친 경우                          |
| Style           | 코드 포맷 변경을 하거나 세미 콜론 누락하여 추가하면서 코드 수정이 없는 경우 |
| Refactor        | 코드를 리팩토링한 경우                                |
| Comment         | 주석을 추가하거나 변경한 경우                            |
| Docs            | 문서를 수정한 경우                                  |
| Test            | 테스트 코드를 추가, 변경, 리팩토링한 경우                    |
| Chore           | 기타 변경사항 (빌드 스크립트 수정, 패키지 매니징 설정 등)          |
| Rename          | 파일 or 폴더명 수정하거나 옮기는 경우                      |
| Remove          | 파일을 삭제하는 작업만 수행한 경우                         |