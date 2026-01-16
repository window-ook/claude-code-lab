# Claude-Code-Lab Skills Installer

Claude Code Lab 스킬을 단일로 설치하는 CLI 도구입니다. (by windowook)

## 📖 사용법

### 스킬 목록 보기

```bash
npx claude-code-lab list
```

### 특정 스킬 설치

```bash
npx claude-code-lab install <skill-name>
```

예시:

```bash
npx claude-code-lab install nextjs-16
npx claude-code-lab install prd
npx claude-code-lab install idea-plan
npx claude-code-lab install code-flow-report
```

### 모든 스킬 설치

```bash
npx claude-code-lab install --all
```

## 🪄 설치 가능한 스킬

| 스킬               | 설명                              |
| ------------------ | --------------------------------- |
| `nextjs-16`        | Next.js 16 App Router 개발 가이드 |
| `prd`              | 제품 요구사항 정의서(PRD) 작성    |
| `idea-plan`        | 아이디어 기획서 작성              |
| `code-flow-report` | 코드 플로우 시각화 리포트 생성    |

## 📍 설치 위치

스킬은 현재 디렉토리의 `.claude/skills/` 폴더에 설치됩니다.

```
your-project/
└── .claude/
    └── skills/
        └── nextjs-16/    # 설치된 스킬
            └── SKILL.md
            └── references/
```
