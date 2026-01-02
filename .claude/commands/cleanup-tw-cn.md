# Cleanup Tailwind className

$ARGUMENTS

- width, height가 동일한데 개별적으로 선언된 것을 `size-`로 통일합니다.
- ml/mr가동일한데 개별적으로 선언된 것을 `mx-`로 통일합니다.
- mt/mb가 동일한데 개별적으로 선언된 것을 `my-`로 통일합니다.
- 같은 구조와 패턴을 가진 요소에서 개별 하드코딩된 컬러, 텍스트 크기 등을 커스텀 지시어로 선언합니다.

**example**

```css
@layer components {
  .landing-description {
    @apply font-medium text-gray-700;
  }
}
```
