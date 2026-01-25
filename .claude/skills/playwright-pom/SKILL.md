---
name: playwright-pom
description: Use when creating Playwright E2E tests with Page Object Model pattern, when generating new test files or page objects, when refactoring existing tests for better reusability, or when test code has duplicated selectors and methods across files
---

# Playwright Page Object Model

## Overview

Playwright E2E 테스트를 위한 Page Object Model(POM) 패턴 가이드입니다.
**핵심 원칙**: 선택자와 비즈니스 로직을 분리하여 유지보수성과 재사용성을 극대화합니다.

## When to Use

**Use when:**

- 새로운 E2E 테스트 파일을 생성할 때
- 새로운 Page Object 클래스를 만들 때
- 여러 테스트에서 동일한 선택자/액션이 반복될 때
- API 모킹 로직을 구조화할 때

**Don't use for:**

- 단순한 일회성 테스트
- Unit/Integration 테스트 (Playwright 외)

## Directory Structure

```
tests/e2e/
├── page-objects/           # POM 클래스들
│   ├── SignInPage.ts
│   ├── MainPage.ts
│   └── CollectionPage.ts
├── utils/
│   ├── constants.ts        # 상수 (선택자, 목 데이터, 메시지)
│   └── helpers.ts          # 공유 헬퍼 함수
└── core-flow/              # 테스트 스펙 파일들
    ├── group-a-unauthenticated/
    ├── group-b-bookmark/
    └── group-c-collection/
```

## Page Object 클래스 구조

### 기본 템플릿

```typescript
import { Page, Locator } from 'playwright-core';
import { TEST_SELECTORS, MOCK_DATA } from '@/tests/e2e/utils/constants';

export class ExamplePage {
  // 1. 페이지 객체
  readonly page: Page;

  // 2. Locator 속성 (readonly로 불변성 보장)
  readonly submitButton: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // 생성자에서 locator 초기화
    this.submitButton = page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT);
    this.emailInput = page.getByTestId(TEST_SELECTORS.INPUT_EMAIL);
  }

  // 3. 네비게이션 메서드
  async goto() {
    await this.page.goto('/example');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // 4. 액션 메서드 (비즈니스 관점 네이밍)
  async fillForm(email: string) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
    await this.page.waitForLoadState();
  }

  // 5. API 모킹 메서드 (mock- 접두사)
  async mockAPISuccess() {
    await this.page.route('**/api/example**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_DATA),
      });
    });
  }
}
```

### Locator 선언 규칙

```typescript
// ✅ 좋음: 생성자에서 readonly 속성으로 선언
readonly submitButton: Locator;
constructor(page: Page) {
    this.submitButton = page.getByTestId('submit-button');
}

// ❌ 나쁨: 메서드 내에서 직접 선택
async submit() {
    await this.page.getByTestId('submit-button').click(); // 중복 가능성
}
```

### 메서드 네이밍 컨벤션

| 접두사   | 용도               | 예시                                 |
| -------- | ------------------ | ------------------------------------ |
| `goto`   | 페이지 이동        | `goto()`, `goToCollection()`         |
| `fill`   | 입력 필드 채우기   | `fillForm()`, `fillEmail()`          |
| `click`  | 요소 클릭          | `clickSubmit()`, `clickCafe()`       |
| `select` | 드롭다운/옵션 선택 | `selectRating()`, `selectCategory()` |
| `mock`   | API 모킹           | `mockAPISuccess()`, `mockAuthAPI()`  |
| `ensure` | 상태 확인/설정     | `ensureAuthenticated()`              |
| `wait`   | 대기 로직          | `waitForResults()`                   |

## Constants 구조 (utils/constants.ts)

```typescript
/** 테스트 선택자 - data-testid 값들 */
export const TEST_SELECTORS = {
  // 입력 필드
  INPUT_EMAIL: 'email-input',
  INPUT_PASSWORD: 'password-input',

  // 버튼
  BUTTON_SUBMIT: 'button-submit',
  BUTTON_SIGNIN: 'button-signin',

  // 컨테이너
  SLIDING_DRAWER: 'sliding-drawer',
} as const;

/** 모킹 인증 데이터 */
export const MOCK_AUTH_DATA = {
  USER_ID: 'mock-user-id',
  SIGNUP_EMAIL: 'test@example.com',
  ACCESS_TOKEN: 'mock-jwt-token',
} as const;

/** API 경로 패턴 */
export const API_PATHS = {
  SUPABASE_AUTH: '**/auth/v1/**',
  SUPABASE_REST: '**/rest/v1/**',
} as const;

/** 에러 메시지 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
} as const;
```

## Helpers 구조 (utils/helpers.ts)

여러 POM에서 반복되는 로직을 추출:

```typescript
import { Page } from 'playwright-core';
import { MOCK_AUTH_DATA } from './constants';

/**
 * localStorage에 인증 상태 설정
 * 여러 Page Object에서 공통으로 사용
 */
export async function ensureAuthenticated(page: Page): Promise<void> {
  const userId = await page.evaluate(() => {
    const store = localStorage.getItem('userStore');
    if (store) {
      const parsed = JSON.parse(store);
      return parsed.state?.userId || null;
    }
    return null;
  });

  if (!userId) {
    await page.evaluate(mockData => {
      const userStoreState = {
        state: {
          userId: mockData.USER_ID,
          userEmail: mockData.SIGNUP_EMAIL,
          userTier: 'BEGINNER',
          isAdmin: false,
        },
        version: 0,
      };
      localStorage.setItem('userStore', JSON.stringify(userStoreState));
      (window as any).__PLAYWRIGHT_TEST__ = true;
    }, MOCK_AUTH_DATA);

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  }
}

/**
 * Supabase DB 형식으로 배열 필드 변환
 */
export function formatForSupabaseDB<T extends Record<string, unknown>>(
  data: T[],
  arrayFields: (keyof T)[],
): T[] {
  return data.map(item => {
    const formatted = { ...item };
    for (const field of arrayFields) {
      if (Array.isArray(formatted[field])) {
        (formatted as any)[field] = JSON.stringify(formatted[field]);
      }
    }
    return formatted;
  });
}
```

## API 모킹 패턴

### 단일 메서드로 CRUD 통합

```typescript
/** Supabase REST API 모킹 (GET, POST, PATCH, DELETE 통합) */
async mockCollectionAPI() {
    await this.page.route('**/rest/v1/collection**', async route => {
        const method = route.request().method();

        switch (method) {
            case 'GET':
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(MOCK_COLLECTION_DATA)
                });
                break;
            case 'POST':
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([{ id: 1, ...route.request().postDataJSON() }])
                });
                break;
            case 'PATCH':
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([{ ...MOCK_COLLECTION_DATA[0], ...route.request().postDataJSON() }])
                });
                break;
            case 'DELETE':
                await route.fulfill({ status: 204, body: '' });
                break;
            default:
                await route.continue();
        }
    });
}
```

### 외부 API 모킹 (카카오맵 등)

```typescript
async mockKakaoSearchAPI(resultCount = 20) {
    await this.page.route('**/v2/local/search/keyword.json**', route => {
        const mockResponse = {
            documents: Array.from({ length: resultCount }, (_, i) => ({
                id: `${1000 + i}`,
                place_name: `테스트카페${i + 1}`,
                address_name: `대구 중구 동문동 ${10 + i}`,
                x: `${128.60 + (i * 0.001)}`,
                y: `${35.87 + (i * 0.001)}`,
            })),
            meta: { total_count: resultCount, is_end: true }
        };

        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockResponse)
        });
    });
}
```

## 테스트 스펙 작성 패턴

```typescript
import { test, expect } from '@playwright/test';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

test.describe('기능 그룹 설명', () => {
  test('시나리오: 사용자가 X를 하면 Y가 된다', async ({ page }) => {
    // 1. Page Object 인스턴스 생성
    const signInPage = new SignInPage(page);
    const mainPage = new MainPage(page);

    // 2. API 모킹 설정 (페이지 이동 전에!)
    await mainPage.mockKakaoSearchAPI();

    // 3. 페이지 이동 및 액션
    await page.goto('/signin');
    await signInPage.fillSignInForm(
      MOCK_AUTH_DATA.SIGNUP_EMAIL,
      MOCK_AUTH_DATA.SIGNUP_PASSWORD,
    );
    await signInPage.signIn();

    // 4. 검증
    await page.waitForURL('**/main**');
    await expect(page).toHaveURL(/.*main.*/);
  });
});
```

## 체크리스트

### Page Object 생성 시

- [ ] `readonly` locator 속성으로 선택자 선언
- [ ] 생성자에서 locator 초기화
- [ ] 비즈니스 관점 메서드명 사용 (goto, fill, click, select, mock)
- [ ] API 모킹은 CRUD 통합 메서드로 구현
- [ ] 중복 로직은 helpers.ts로 추출

### 테스트 스펙 작성 시

- [ ] API 모킹은 페이지 이동 **전에** 설정
- [ ] Page Object 메서드로 액션 수행 (직접 선택자 사용 X)
- [ ] 적절한 waitFor/waitForURL 사용
- [ ] expect로 명확한 검증

### Constants 관리

- [ ] 선택자는 TEST_SELECTORS에 집중
- [ ] 모킹 데이터는 MOCK\_\* 상수로 분리
- [ ] 하드코딩된 문자열 없이 상수 참조

## Common Mistakes

| 실수                            | 수정                        |
| ------------------------------- | --------------------------- |
| 여러 POM에 동일한 메서드 중복   | helpers.ts로 추출           |
| 테스트 내에서 직접 선택자 사용  | Page Object 메서드로 캡슐화 |
| 모킹 설정 후 페이지 이동        | 모킹 먼저, 이동 나중        |
| 하드코딩된 선택자/데이터        | constants.ts 상수 사용      |
| GET/POST/PATCH 개별 모킹 메서드 | 통합 API 모킹 메서드        |

## Red Flags

- 동일한 `getByTestId()` 호출이 여러 파일에 반복됨
- `ensureAuthenticated()` 같은 메서드가 3개 이상 POM에 복사됨
- 테스트 파일에서 직접 `page.route()` 호출
- 상수 대신 매직 스트링/넘버 사용
- deprecated 메서드가 남아있음 (하위 호환성 핑계)
