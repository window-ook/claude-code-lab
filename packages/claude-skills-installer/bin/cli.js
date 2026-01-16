#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TARGET_DIR = path.join(process.cwd(), '.claude', 'skills');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function getAvailableSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];

  return fs.readdirSync(SKILLS_DIR).filter(name => {
    const skillPath = path.join(SKILLS_DIR, name);
    return fs.statSync(skillPath).isDirectory() &&
      fs.existsSync(path.join(skillPath, 'SKILL.md'));
  });
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkill(skillName) {
  const skillSrc = path.join(SKILLS_DIR, skillName);
  const skillDest = path.join(TARGET_DIR, skillName);

  if (!fs.existsSync(skillSrc)) {
    log(`\n  오류: '${skillName}' 스킬을 찾을 수 없습니다.`, COLORS.red);
    return false;
  }

  if (fs.existsSync(skillDest)) {
    log(`\n  경고: '${skillName}' 스킬이 이미 존재합니다. 덮어씁니다.`, COLORS.yellow);
    fs.rmSync(skillDest, { recursive: true });
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });
  copyDirRecursive(skillSrc, skillDest);

  log(`\n  ✓ '${skillName}' 스킬이 설치되었습니다.`, COLORS.green);
  log(`    경로: ${skillDest}`, COLORS.cyan);

  return true;
}

function listSkills() {
  const skills = getAvailableSkills();

  log('\n┌───────────────────────────────────────────────────────────┐', COLORS.cyan);
  log('│       Claude-Code-Lab Skills Installer (by window-ook)   │', COLORS.cyan);
  log('└───────────────────────────────────────────────────────────┘', COLORS.cyan);

  if (skills.length === 0) {
    log('\n  설치 가능한 스킬이 없습니다.', COLORS.yellow);
    return;
  }

  log('\n  설치 가능한 스킬 목록:\n', COLORS.bright);

  const descriptions = {
    'code-flow-report': '코드 플로우 시각화 리포트 생성',
    'idea-plan': '아이디어 기획서 작성',
    'prd': '제품 요구사항 정의서(PRD) 작성',
    'nextjs-16': 'Next.js 16 App Router 개발 가이드',
  };

  skills.forEach((skill, index) => {
    const desc = descriptions[skill] || '설명 없음';
    log(`  ${index + 1}. ${COLORS.green}${skill}${COLORS.reset}`);
    log(`     ${desc}\n`);
  });
}

function showHelp() {
  log('\n┌───────────────────────────────────────────────────────────┐', COLORS.cyan);
  log('│       Claude-Code-Lab Skills Installer (by window-ook)   │', COLORS.cyan);
  log('└───────────────────────────────────────────────────────────┘', COLORS.cyan);

  log('\n  사용법:', COLORS.bright);
  log(`    npx claude-code-lab ${COLORS.green}list${COLORS.reset}              스킬 목록 보기`);
  log(`    npx claude-code-lab ${COLORS.green}install <name>${COLORS.reset}    특정 스킬 설치`);
  log(`    npx claude-code-lab ${COLORS.green}install --all${COLORS.reset}     모든 스킬 설치`);

  log('\n  예시:', COLORS.bright);
  log(`    npx claude-code-lab install nextjs-16`, COLORS.cyan);
  log(`    npx claude-code-lab install prd`, COLORS.cyan);
  log(`    npx claude-code-lab install --all`, COLORS.cyan);

  log('\n  설치 위치:', COLORS.bright);
  log(`    현재 디렉토리의 .claude/skills/ 폴더에 설치됩니다.\n`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  if (command === 'list' || command === 'ls') {
    listSkills();
    return;
  }

  if (command === 'install' || command === 'i') {
    const skillName = args[1];

    if (!skillName) {
      log('\n  오류: 설치할 스킬 이름을 입력해주세요.', COLORS.red);
      log('  사용법: npx claude-code-lab install <skill-name>', COLORS.yellow);
      log('  목록 보기: npx claude-code-lab list\n', COLORS.yellow);
      process.exit(1);
    }

    if (skillName === '--all' || skillName === '-a') {
      const skills = getAvailableSkills();
      log('\n  모든 스킬을 설치합니다...', COLORS.blue);

      let successCount = 0;
      for (const skill of skills) {
        if (installSkill(skill)) successCount++;
      }

      log(`\n  완료: ${successCount}/${skills.length}개 스킬이 설치되었습니다.\n`, COLORS.green);
      return;
    }

    const available = getAvailableSkills();
    if (!available.includes(skillName)) {
      log(`\n  오류: '${skillName}' 스킬을 찾을 수 없습니다.`, COLORS.red);
      log('  사용 가능한 스킬:', COLORS.yellow);
      available.forEach(s => log(`    - ${s}`, COLORS.cyan));
      log('');
      process.exit(1);
    }

    installSkill(skillName);
    log('');
    return;
  }

  log(`\n  알 수 없는 명령어: ${command}`, COLORS.red);
  showHelp();
  process.exit(1);
}

main();
