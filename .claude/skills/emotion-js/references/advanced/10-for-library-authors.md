# For Library Authors

**Source**: https://emotion.sh/docs/for-library-authors

---

## Contents

- [1. Overview](#1-overview)
- [2. Emotion 의존성의 단점](#2-emotion-의존성의-단점)
- [3. 대안: 일반 CSS 파일 제공](#3-대안-일반-css-파일-제공)
- [4. Emotion 사용 시 필수 사항: Peer Dependencies](#4-emotion-사용-시-필수-사항-peer-dependencies)
- [5. 라이브러리 설계 가이드라인](#5-라이브러리-설계-가이드라인)
- [Key Principles](#key-principles)

---

## 1. Overview

컴포넌트 라이브러리를 작성할 때 Emotion에 의존할지 **신중하게 검토**해야 합니다. 대안으로 일반 CSS 파일을 포함하여 사용자가 직접 import하도록 하는 방식이 있습니다.

---

## 2. Emotion 의존성의 단점

### 버전 호환성 문제

라이브러리와 소비 애플리케이션이 **동일한 Emotion 버전**을 사용해야 합니다. 라이브러리가 Emotion 11을 요구하는데 사용자 앱이 Emotion 10을 사용하면 충돌이 발생합니다.

```
// 충돌 시나리오
my-component-library: @emotion/react@^11.0.0
user-app:             @emotion/react@^10.0.0  // 버전 불일치
```

### 번들 사이즈 증가

소수의 작은 컴포넌트만 포함하는 라이브러리에서 Emotion을 포함하면 **번들 사이즈가 크게 증가**할 수 있습니다.

### 엣지 케이스 취약성

특정 환경에서 Emotion이 CSS 파일보다 **덜 안정적**일 수 있습니다. `react-loading-skeleton`이 Emotion 10을 사용했을 때 다음 환경에서 스타일이 동작하지 않는 보고가 있었습니다:

- 프로덕션 빌드
- iframe 내부
- Shadow DOM

---

## 3. 대안: 일반 CSS 파일 제공

Emotion 대신 일반 CSS 파일을 라이브러리에 포함하면 위의 문제를 모두 회피할 수 있습니다.

```tsx
// 사용자가 CSS를 직접 import
import 'my-component-library/styles.css'
import { Button } from 'my-component-library'
```

이 방식의 장점:
- 버전 충돌 없음
- 추가 번들 사이즈 최소화
- 모든 환경에서 안정적으로 동작

---

## 4. Emotion 사용 시 필수 사항: Peer Dependencies

Emotion을 사용하기로 결정했다면 Emotion 패키지를 반드시 **peer dependencies**로 선언해야 합니다. 이렇게 하면 라이브러리와 소비 앱이 동일한 Emotion 인스턴스를 공유합니다.

```json
// package.json
{
  "name": "my-component-library",
  "peerDependencies": {
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0",
    "react": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
}
```

> `dependencies`가 아닌 `peerDependencies`에 선언해야 중복 인스턴스 문제를 방지할 수 있습니다.

---

## 5. 라이브러리 설계 가이드라인

| 상황 | 권장 방식 |
|---|---|
| 소수의 간단한 컴포넌트 | 일반 CSS 파일 제공 |
| 복잡한 동적 스타일링 필요 | Emotion + peer dependencies |
| 다양한 환경 지원 필요 (iframe, Shadow DOM) | 일반 CSS 파일 제공 |
| 소비 앱이 이미 Emotion 사용 확실 | Emotion + peer dependencies |

### 체크리스트

Emotion을 라이브러리에 도입하기 전 확인:

- [ ] 일반 CSS로 충분하지 않은가?
- [ ] 동적 스타일링이 반드시 필요한가?
- [ ] 타겟 사용자들이 Emotion을 이미 사용하고 있는가?
- [ ] iframe, Shadow DOM 등 특수 환경 지원이 필요한가?
- [ ] peer dependencies로 올바르게 선언했는가?

---

## Key Principles

| 원칙 | 설명 |
|---|---|
| **신중한 의존성 결정** | 라이브러리에서 Emotion 의존 여부를 반드시 검토 |
| **일반 CSS 우선 고려** | 간단한 컴포넌트는 CSS 파일 제공이 더 안전하고 가벼움 |
| **peer dependencies 필수** | Emotion 사용 시 반드시 peerDependencies로 선언하여 버전 충돌 방지 |
| **엣지 케이스 인식** | 프로덕션 빌드, iframe, Shadow DOM에서 문제가 발생할 수 있음 |
| **번들 사이즈 고려** | 소규모 라이브러리에서 Emotion은 상대적으로 큰 오버헤드 |
