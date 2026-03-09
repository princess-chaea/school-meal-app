import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Keyboard, 
  BookOpen, 
  Info, 
  Zap, 
  CheckCircle2,
  X,
  Copy,
  Target,
  Sword,
  CornerDownLeft,
  Trash2,
  MoveHorizontal,
  ArrowUp,
  Delete as BackspaceIcon
} from 'lucide-react';

// --- 이미지 자산 ---
const SHIN_IMG = "https://i.ibb.co/Q3yff3rD/image.png";
const ACTION_MASK_IMG = "https://i.ibb.co/DHWzNQ5Q/image.png";
const VILLAIN_IMG = "https://i.ibb.co/kgLsW9KH/image.png"; // 원장 선생님(두목님)
const DAD_IMG = "https://i.ibb.co/mCYbd379/image.png";
const MOM_IMG = "https://i.ibb.co/mrhjXcdz/image.png";
const FINAL_CELEBRATION_IMG = 'https://i.ibb.co/tTY85PVp/image.png';

const BG_KITCHEN = "https://i.ibb.co/CxD7QVF/image.png";
const BG_SCHOOL = "https://i.ibb.co/d0qVdCzg/image.png";
const BG_BUS = "https://i.ibb.co/RpHmP6ks/image.png";

const KEYBOARD_LAYOUT_IMG = "https://i.ibb.co/nMPHDWm5/1.jpg"; // 키보드 자판 이미지
const KEY_EXPLANATION_IMG = "https://i.ibb.co/C3VXQ3cY/image.jpg"; // 키보드 버튼 설명 이미지

// --- 데이터 정의 ---
const KEYBOARD_THEORY = [
  {
    id: 'basic',
    title: '공격과 방어 (삭제/입력)',
    keys: [
      { name: 'Backspace (백스페이스)', desc: '커서 앞글자를 지워요. 오타 빌런을 물리칠 때 기본이죠!', icon: <BackspaceIcon size={20} />, matchKey: 'Backspace' },
      { name: 'Delete (딜리트)', desc: '커서 뒷글자를 지워요. 자리에 서서 뒤를 공격!', icon: <Trash2 size={20} />, matchKey: 'Delete' },
      { name: 'Enter (엔터)', desc: '결정타를 날리거나 다음 줄로 이동할 때 쾅!', icon: <CornerDownLeft size={20} />, matchKey: 'Enter' },
    ]
  },
  {
    id: 'special',
    title: '변신 기술 (조합/이동)',
    keys: [
      { name: 'Shift (쉬프트)', desc: '쌍자음 파워! 누른 채로 자음을 누르면 강해져요.', icon: <ArrowUp size={20} />, matchKey: 'Shift' },
      { name: 'Home (홈)', desc: '줄의 처음으로 순간이동하는 고급 기술!', icon: <MoveHorizontal size={20} />, matchKey: 'Home' },
      { name: 'End (엔드)', desc: '줄의 끝으로 순간이동하는 고급 기술!', icon: <MoveHorizontal size={20} />, matchKey: 'End' },
    ]
  },
  {
    id: 'shortcut',
    title: '마법의 복제술 (단축키)',
    keys: [
      { name: 'Ctrl + C/V (컨트롤 C/V)', desc: '에너지를 복사해서 무한으로 붙여넣는 마법!', icon: <Copy size={20} />, matchKey: 'Control' },
      { name: 'Ctrl + A (컨트롤 A)', desc: '화면의 모든 에너지를 한꺼번에 선택해요.', icon: <Target size={20} />, matchKey: 'Control' },
    ]
  }
];

const STAGES = [
  {
    id: 1,
    level: '기초',
    title: "엄마의 심부름 (Backspace / 백스페이스)",
    bg: BG_KITCHEN,
    dialogue: [
      { speaker: 'MOM', text: "짱구야, 엄마가 적어둔 장보기 목록에서 '사탕'을 좀 지워줄래?" },
      { speaker: 'SHIN', text: "에에~ 사탕은 몸에 좋은데... 알겠어요!" },
      { speaker: 'MOM', text: "커서 바로 앞에 있는 글자를 지울 땐 'Backspace'를 쓰는 거야!" }
    ],
    instruction: "Backspace(백스페이스) 키를 눌러 '사탕'을 지워보자!",
    type: 'edit',
    text: '사과 배 사탕 고기',
    targetText: '사과 배  고기',
    requiredKey: 'Backspace',
    initialCursorPos: 7, // '사탕' 뒤
    hint: "글자 뒤에 커서를 두고 Backspace를 눌러!",
    failMsg: "Backspace 키를 정확히 사용해야 해!"
  },
  {
    id: 2,
    level: '기초',
    title: "아빠의 서류 정리 (Delete / 딜리트)",
    bg: BG_KITCHEN,
    dialogue: [
      { speaker: 'DAD', text: "짱구야, 아빠 서류에 '꽝'이라는 글자가 들어갔네. 이것 좀 지워줘." },
      { speaker: 'SHIN', text: "아빠, 이건 'Delete' 키로 지우는 게 더 빠를걸요?" },
      { speaker: 'DAD', text: "오, 우리 짱구 똑똑한데? 커서 뒤에 있는 글자를 지울 땐 'Delete'지!" }
    ],
    instruction: "Delete(딜리트) 키를 눌러 '꽝'을 지워보자!",
    type: 'edit',
    text: '이 서류는 꽝입니다',
    targetText: '이 서류는 입니다',
    requiredKey: 'Delete',
    initialCursorPos: 6, // '꽝' 앞 (공백 뒤)
    hint: "커서를 '는'과 '꽝' 사이에 두고 Delete를 눌러!",
    failMsg: "Delete 키를 사용해야 해! (Backspace는 안돼요)"
  },
  {
    id: 3,
// ... (omitted)
    level: '기초',
    title: "유치원 버스 알림 (Enter / 엔터)",
    bg: BG_BUS,
    dialogue: [
      { speaker: 'SHIN', text: "친구들에게 인사를 하고 싶어요!" },
      { speaker: 'ACTION', text: "좋아 짱구야! 줄을 바꿔서 멋지게 인사해 보자!" },
      { speaker: 'ACTION', text: "다음 줄로 넘어갈 땐 'Enter' 에너지를 발산하는 거다!" }
    ],
    instruction: "Enter(엔터) 키를 눌러 줄을 바꾸고 완성해!",
    type: 'edit',
    text: '안녕 친구들아나 짱구야',
    targetText: '안녕 친구들아\n나 짱구야',
    requiredKey: 'Enter',
    hint: "줄을 바꾸고 싶은 위치에서 Enter를 쾅!",
    failMsg: "Enter 키로 줄을 바꿔야 해!"
  },
  {
    id: 4,
    level: '심화',
    title: "쌍자음 파워 전수 (Shift / 쉬프트)",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'VILLAIN', text: "흐흐흐... '토끼'를 '도끼'라고 쓸 텐가? 쌍자음은 못 쓰겠지!" },
      { speaker: 'ACTION', text: "짱구야! 'Shift' 키와 함께라면 어떤 쌍자음도 무섭지 않아!" },
      { speaker: 'SHIN', text: "으아아! Shift 파워 전개!!" }
    ],
    instruction: "Shift(쉬프트)를 누른 채 자음을 써서 단어를 완성해!",
    type: 'typing',
    targets: ['토끼', '아빠', '뿌리', '씁쓸', '똑똑'],
    failMsg: "Shift 키를 꾹 누른 상태에서 자음을 눌러야 해!"
  },
  {
    id: 5,
    level: '심화',
    title: "커서 닌자술 (Arrow Keys / 방향키)",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'SHIN', text: "커서가 너무 느려요! 빨리 '버섯'만 골라내고 싶어!" },
      { speaker: 'ACTION', text: "방향키(Arrow Keys)를 사용하면 커서를 자유자재로 움직일 수 있지!" },
      { speaker: 'ACTION', text: "단어 사이를 슉슉 이동해 봐!" }
    ],
    instruction: "방향키로 움직여서 '버섯'만 삭제해!",
    type: 'edit',
    text: '당근 오이 버섯 양파',
    targetText: '당근 오이  양파',
    requiredKey: 'Arrow',
    hint: "마우스 대신 방향키로 커서를 옮겨봐!",
    failMsg: "방향키로 커서를 정확하게 옮겨야 해!"
  },
  {
    id: 6,
    level: '심화',
    title: "순간이동 점프 (Home/End / 홈/엔드)",
    bg: BG_BUS,
    dialogue: [
      { speaker: 'VILLAIN', text: "문장이 이렇게 긴데 언제 맨 앞까지 갈 거냐!" },
      { speaker: 'SHIN', text: "후후... 저에겐 'Home'과 'End'라는 순간이동 장치가 있죠!" },
      { speaker: 'ACTION', text: "좋아 짱구야! 단숨에 점프해!" }
    ],
    instruction: "Home(홈) 키를 눌러 맨 앞으로 가서 '성공!'을 적어!",
    type: 'nav',
    text: '미션 완료',
    targetText: '성공!미션 완료',
    requiredKey: 'Home',
    hint: "Home은 맨 앞으로, End는 맨 뒤로!",
    failMsg: "Home 키를 눌러서 한 번에 이동해 봐!"
  },
  {
    id: 7,
    level: '마스터',
    title: "비밀의 공간 (Tab / 탭)",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'VILLAIN', text: "글자 사이를 일정하게 띄우는 건 아주 어려운 기술이지!" },
      { speaker: 'ACTION', text: "짱구야! 'Tab' 키를 사용하면 일정한 마법의 공간을 만들 수 있어!" },
      { speaker: 'SHIN', text: "탭! 탭! 탭! 공간 이동!" }
    ],
    instruction: "글자 사이에 Tab(탭) 키를 눌러 간격을 벌려봐!",
    type: 'edit',
    text: '이름:나짱구',
    targetText: '이름:\t나짱구',
    requiredKey: 'Tab',
    hint: "Space보다 훨씬 멀리 점프하는 Tab 키!",
    failMsg: "Tab 키를 사용해서 간격을 벌려야 해!"
  },
  {
    id: 8,
    level: '마스터',
    title: "위기 탈출 (Esc / 이에스씨)",
    bg: BG_KITCHEN,
    dialogue: [
      { speaker: 'MOM', text: "짱구야! 컴퓨터에 이상한 창이 떴어! 빨리 꺼줘!" },
      { speaker: 'SHIN', text: "걱정 마세요 엄마! 'Esc' 키 한방이면 끝나요!" },
      { speaker: 'ACTION', text: "취소하거나 창을 닫을 땐 Esc가 최고지!" }
    ],
    instruction: "Esc(이에스씨) 키를 눌러 위기에서 탈출해!",
    type: 'esc_challenge',
    text: '광고창이 떴습니다!!!',
    targetKey: 'Escape',
    description: "Esc 키를 누르면 다음 단계로 진행!",
    failMsg: "Esc 키를 눌러야 창이 닫혀!"
  },
  {
    id: 9,
    level: '마스터',
    title: "비밀의 복제술 (Ctrl+C / 복사)",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'SHIN', text: "똑같은 글자를 여러 번 쓰기 힘들어요..." },
      { speaker: 'ACTION', text: "그럴 땐 복제 마법 'Ctrl+C'를 쓰는 거야!" },
      { speaker: 'ACTION', text: "마우스로 글자를 드래그해서 파란색으로 선택한 다음, 'Ctrl' 키를 누른 채 'C'를 눌러봐!" }
    ],
    instruction: "문장을 마우스로 드래그해서 선택하고 Ctrl+C를 눌러 복사해!",
    type: 'shortcut',
    text: '액션가면 최고!',
    targetText: '액션가면 최고!',
    targetAction: 'copy',
    hint: "마우스 왼쪽 버튼을 누른 채 글자 위를 슥~ 드래그하고 Ctrl+C를 눌러!",
    failMsg: "정확한 문장을 드래그해서 Ctrl+C를 눌러야 해!"
  },
  {
    id: 10,
    level: '마스터',
    title: "무한 생성술 (Ctrl+V / 붙여넣기)",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'SHIN', text: "복사한 에너지는 어떻게 사용하죠?" },
      { speaker: 'ACTION', text: "이제 'Ctrl+V' 마법으로 에너지를 방출해!" },
      { speaker: 'ACTION', text: "아래 '미션 수행 중...' 칸을 클릭하고 'Ctrl' 키를 누른 채 'V'를 누르는 거다!" }
    ],
    instruction: "아래 입력창을 클릭한 후 Ctrl+V를 눌러서 문장을 붙여넣어!",
    type: 'shortcut',
    text: '액션가면 최고!',
    targetText: '액션가면 최고!',
    targetAction: 'paste',
    hint: "입력창을 한 번 클릭하고 Ctrl+V를 눌러!",
    failMsg: "Ctrl+V를 눌러서 아까 복사한 문장을 붙여넣어봐!"
  },
  {
    id: 11,
    level: '보스',
    title: "두목님의 마지막 일격",
    bg: BG_SCHOOL,
    dialogue: [
      { speaker: 'VILLAIN', text: "하하하! 내 긴 문장을 오타 없이 수정할 수 있을까?" },
      { speaker: 'SHIN', text: "액션가면님, 힘을 빌려주세요!" },
      { speaker: 'ACTION', text: "짱구야, 지금까지 배운 모든 키를 사용하는 거다! 최종 결전이다!" }
    ],
    instruction: "모든 기술을 동원해 문장을 완성해! (세 가지 마스터 키 필수)",
    type: 'edit',
    text: '유치원은지저분해용',
    targetText: '유치원은\n정말 즐거워!!',
    requiredKeyList: ['Shift', 'Enter', 'Backspace'],
    hint: "Enter로 줄 바꾸기, Shift로 쌍자음과 !! 입력, Backspace로 글자 지우기!",
    failMsg: "포기하지 마! 필수 키 3개를 모두 사용해서 완성하는 거야!"
  }
];

export default function App() {
  const [view, setView] = useState('main');
  const [currentStage, setCurrentStage] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [foundKeys, setFoundKeys] = useState(new Set());
  const inputRef = useRef(null);

  const [gameState, setGameState] = useState({
    input: '',
    completed: false,
    message: '',
    targetIdx: 0,
    isCtrlPressed: false,
    clipboard: '',
    showError: false,
    showKeyboardMap: false,
    lastKeyPressed: '',
    viewMode: 'dialogue', // 'dialogue' or 'play'
    showSuccessEffect: false,
    usedKeys: [] 
  });

  const startLevel = (idx) => {
    setCurrentStage(idx);
    setCurrentDialogueIdx(0);
    const stage = STAGES[idx];
    setGameState(prev => ({
      input: (stage.type === 'typing' || stage.type === 'shortcut') ? '' : stage.text,
      completed: false,
      message: '',
      targetIdx: 0,
      isCtrlPressed: false,
      clipboard: prev.clipboard, // 이전 클립보드 유지
      showError: false,
      showKeyboardMap: false,
      lastKeyPressed: '',
      viewMode: 'dialogue',
      showSuccessEffect: false,
      usedKeys: []
    }));
    setView('game');
  };

  // 이론 공부 화면에서 키 찾기 인터랙션
  useEffect(() => {
    if (view === 'theory') {
      const handleTheoryKey = (e) => {
        if (e.repeat) return; // 연속 입력 방지
        const key = e.key;
        KEYBOARD_THEORY.forEach(section => {
          section.keys.forEach(k => {
            // 정확한 매칭 (Shift 등 다른 키가 섞이지 않도록)
            if (k.matchKey === key || (k.matchKey === 'Control' && key === 'Control')) {
              setFoundKeys(prev => {
                const next = new Set(prev);
                next.add(k.name);
                return next;
              });
            }
          });
        });
      };
      window.addEventListener('keydown', handleTheoryKey);
      return () => window.removeEventListener('keydown', handleTheoryKey);
    }
  }, [view]);

  // 미션 시작 시 특정 조건에서 커서 위치 조정
  useEffect(() => {
    if (view === 'game' && gameState.viewMode === 'play' && inputRef.current) {
      inputRef.current.focus();
      const stage = STAGES[currentStage];
      
      if (stage.initialCursorPos !== undefined) {
        inputRef.current.setSelectionRange(stage.initialCursorPos, stage.initialCursorPos);
      } else if (stage.requiredKey === 'Home' || stage.id === 6) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [view, gameState.viewMode, currentStage]);

  // 강력한 포커스 유지 (Sticky Focus)
  useEffect(() => {
    if (view === 'game' && gameState.viewMode === 'play') {
      const handleGlobalClick = (e) => {
        // 드래그/선택을 위해 특정 클래스는 포커스 강제 이동 제외
        const isSelectable = e.target.closest('.selectable-text');
        
        // 모달이나 네비게이션 클릭이 아닐 경우 항상 입력창에 포커스
        if (inputRef.current && !gameState.showKeyboardMap && !isSelectable) {
           setTimeout(() => inputRef.current.focus(), 10);
        }
      };
      window.addEventListener('mousedown', handleGlobalClick);
      return () => window.removeEventListener('mousedown', handleGlobalClick);
    }
  }, [view, gameState.viewMode, gameState.showKeyboardMap]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== 'game' || gameState.viewMode !== 'play' || gameState.showSuccessEffect) return;
      
      const stage = STAGES[currentStage];
      setGameState(prev => {
        const newState = { ...prev, lastKeyPressed: e.key };
        
        // 필수 키 트래킹 (보스 스테이지 등)
        if (stage.requiredKeyList && stage.requiredKeyList.includes(e.key)) {
            if (!prev.usedKeys.includes(e.key)) {
                newState.usedKeys = [...prev.usedKeys, e.key];
            }
        }
        return newState;
      });

      // Tab 키 방어 (포커스 나가는 것 방지 및 입력 처리)
      if (e.key === 'Tab') {
        e.preventDefault();
        if (stage.requiredKey === 'Tab') {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newVal = gameState.input.substring(0, start) + "\t" + gameState.input.substring(end);
            
            // Refactored Match Check
            if (!checkCompletion(newVal, stage)) {
                setGameState(prev => ({ ...prev, input: newVal }));
            }
            
            // 다음 렌더링 후 커서 유지
            setTimeout(() => {
                if (inputRef.current) inputRef.current.setSelectionRange(start + 1, start + 1);
            }, 0);
        }
        return;
      }

      // 미션에 따른 이동 제약 (Home/End 미션에서 방향키 금지)
      if ((stage.requiredKey === 'Home' || stage.id === 6) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        setGameState(prev => ({ ...prev, showError: true, message: "방향키 대신 Home/End 키를 사용하세요!" }));
        return;
      }

      if (stage.type === 'esc_challenge' && e.key === 'Escape') {
        setGameState(prev => ({ ...prev, showSuccessEffect: true }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, completed: true, showSuccessEffect: false }));
        }, 1500);
        return;
      }

      // 부적절한 키 입력 차단 (타이핑형이 아닌 경우)
      if (stage.type === 'edit' || stage.type === 'nav') {
          // 글자/숫자 키 입력을 막고 오직 백스페이스, 딜리트, 방향키(제약 없을때), 엔터만 허용
          // 하지만 Stage 6, 10은 직접 입력을 병행해야 하므로 예외 처리
          const isActionKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Tab', 'Shift', 'Alt'].includes(e.key);
          const canTypeInThisStage = [6, 11].includes(stage.id);
          
          if (!isActionKey && e.key.length === 1 && !e.ctrlKey && !canTypeInThisStage) {
              e.preventDefault();
              setGameState(prev => ({ ...prev, showError: true, message: "지금은 입력보다 키 기능을 익힐 때예요!" }));
              return;
          }
      }

      if (stage.requiredKey) {
        if (stage.requiredKey === 'Backspace' && e.key === 'Delete') {
          e.preventDefault();
          setGameState(prev => ({ ...prev, showError: true, message: "Backspace를 사용해야 해요!" }));
          return;
        }
        if (stage.requiredKey === 'Delete' && e.key === 'Backspace') {
          e.preventDefault();
          setGameState(prev => ({ ...prev, showError: true, message: "Delete를 사용해야 해요!" }));
          return;
        }
      }

      if (e.ctrlKey) {
        setGameState(prev => ({ ...prev, isCtrlPressed: true }));
        if (stage.type === 'shortcut') {
          const key = e.key.toLowerCase();
          if (key === 'c') {
            // targetAction 이 copy 면 드래그로 선택된 텍스트가 있는지 확인
            if (stage.targetAction === 'copy') {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText === stage.targetText) {
                    setGameState(prev => ({ ...prev, clipboard: stage.text }));
                    checkCompletion(stage.text, stage); 
                } else {
                    setGameState(prev => ({ ...prev, showError: true, message: "먼저 문장을 마우스로 드래그해서 파란색으로 선택해야 해요!" }));
                    return;
                }
            } else {
                setGameState(prev => ({ ...prev, message: '📋 복사 성공!', clipboard: stage.text }));
            }
          } else if (key === 'v') {
            if (stage.targetAction === 'paste') {
                e.preventDefault();
                if (gameState.clipboard === stage.text) {
                  // checkCompletion 사용
                  checkCompletion(stage.text, stage);
                } else {
                  setGameState(prev => ({ ...prev, showError: true, message: stage.failMsg }));
                }
            }
          }
        }
      }
    };
    const handleKeyUp = (e) => { if (e.key === 'Control') setGameState(prev => ({ ...prev, isCtrlPressed: false })); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [view, currentStage, gameState.viewMode, gameState.clipboard]);

  const checkCompletion = (val, stage) => {
    let isMatch = false;
    if (stage.type === 'typing') {
      const currentTarget = stage.targets[gameState.targetIdx];
      isMatch = (val === currentTarget);
    } else {
      isMatch = (val.replace(/\r/g, "") === stage.targetText);
    }

    if (isMatch) {
      // 필수 키 리스트가 있는 경우 모든 키를 사용했는지 확인
      if (stage.requiredKeyList) {
          const allUsed = stage.requiredKeyList.every(k => gameState.usedKeys.includes(k));
          if (!allUsed) {
            setGameState(prev => ({ ...prev, showError: true, message: "모든 마스터 키(Shift, Enter, Backspace)를 한 번씩 사용해야 보스를 물리칠 수 있어요!" }));
            return false;
          }
      }

      if (stage.type === 'typing') {
        if (gameState.targetIdx < stage.targets.length - 1) {
          setGameState(prev => ({ ...prev, input: '', targetIdx: prev.targetIdx + 1, message: '정답입니다! 🌟' }));
        } else {
          setGameState(prev => ({ ...prev, input: val, showSuccessEffect: true, message: '모두 맞혔어요! 🎉' }));
          setTimeout(() => {
            setGameState(prev => ({ ...prev, completed: true, showSuccessEffect: false }));
          }, 1500);
        }
      } else {
        setGameState(prev => ({ ...prev, input: val, showSuccessEffect: true, message: '미션 클리어! ✨' }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, completed: true, showSuccessEffect: false }));
        }, 1500);
      }
      return true;
    }
    return false;
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const stage = STAGES[currentStage];
    setGameState(prev => ({ ...prev, showError: false }));

    // 문장 보호 (Anti-Vandalism)
    // 보스 스테이지(id: 11)는 자유로운 편집을 위해 제외
    if (stage.type === 'edit' && stage.id !== 11) {
        let testVal = val.replace(/\r/g, "");
        if (testVal.length < stage.targetText.length - 2) {
             setGameState(prev => ({ ...prev, showError: true, message: "너무 많이 지웠어요! 다시 해볼까요?" }));
             setGameState(prev => ({ ...prev, input: stage.text })); // 강제 복구
             return;
        }
    }

    if (!checkCompletion(val, stage)) {
      setGameState(prev => ({ ...prev, input: val }));
    }
  };

  const handleMouseDown = (e) => {
    const stage = STAGES[currentStage];
    if (['Arrow', 'Home', 'Delete', 'Backspace'].includes(stage.requiredKey) || stage.id === 6) {
      e.preventDefault();
    }
  };

  const totalKeys = KEYBOARD_THEORY.reduce((acc, curr) => acc + curr.keys.length, 0);

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-800 font-sans selection:bg-blue-200 focus-within:outline-none">
      {/* 네비게이션 */}
      <nav className="bg-white border-b-4 border-yellow-400 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => {
                if (view === 'game' && gameState.viewMode === 'play' && !gameState.completed) {
                    if (window.confirm("대결 중이에요! 처음으로 돌아가면 진행 상황이 사라져요. 그래도 갈까요?")) {
                        setView('main');
                    }
                } else {
                    setView('main');
                }
            }}
        >
          <div className="relative group-hover:scale-110 transition-transform">
            <img src={ACTION_MASK_IMG} alt="Action" className="w-10 h-10" />
            <img src={SHIN_IMG} alt="Shin" className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white" />
          </div>
          <span className="font-black text-xl text-yellow-600 tracking-tight italic">KEYBOARD DEFENSE</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setGameState(prev => ({ ...prev, showKeyboardMap: true }))} className="px-6 py-2.5 rounded-xl font-black bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all text-sm active:scale-95">키보드 지도 (팝업)</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* 메인 화면 */}
        {view === 'main' && (
          <div className="text-center py-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-center items-center gap-4">
              <img src={SHIN_IMG} alt="Shin" className="w-24 h-24 drop-shadow-lg" />
              <div className="bg-white p-4 rounded-3xl border-4 border-yellow-400 font-black shadow-lg relative">
                "두목님! 아니, 원장 선생님을 이겨보자!"
                <div className="absolute -left-3 top-4 w-4 h-4 bg-white border-l-4 border-t-4 border-yellow-400 rotate-[-45deg]"></div>
              </div>
            </div>

            <div className="relative inline-block">
              <img src={ACTION_MASK_IMG} alt="Hero" className="w-40 h-40 animate-bounce duration-[3000ms] drop-shadow-2xl" />
              <img src={VILLAIN_IMG} alt="Boss" className="w-32 h-32 absolute -right-24 bottom-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">키보드 수호대:<br /><span className="text-yellow-500">두목님의 습격!</span></h1>
              <p className="text-lg text-slate-500 font-bold">"액션가면과 함께 키보드 기술을 완벽하게 익히자!"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <button 
                onClick={() => setView('theory')} 
                className={`bg-white p-8 rounded-[40px] border-4 transition-all hover:-translate-y-2 shadow-xl group text-left ${
                  foundKeys.size === totalKeys 
                    ? 'border-green-200 hover:border-green-400' 
                    : 'border-yellow-200 hover:border-yellow-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <BookOpen className="text-blue-500 group-hover:scale-125 transition-transform" size={40} />
                  {foundKeys.size === totalKeys && <CheckCircle2 className="text-green-500 animate-bounce" />}
                </div>
                <h3 className="text-2xl font-black mb-1 text-slate-900">1. 마법 지도 공부 (키보드)</h3>
                <p className="text-slate-500 font-bold">먼저 버튼들의 비밀을{foundKeys.size === totalKeys ? ' 모두 익혔어요!' : ' 그림으로 배워요!'}</p>
                <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(foundKeys.size / totalKeys) * 100}%` }} />
                </div>
              </button>
              
              <button 
                onClick={() => foundKeys.size === totalKeys ? startLevel(0) : null} 
                disabled={foundKeys.size !== totalKeys}
                className={`p-8 rounded-[40px] border-4 text-left transition-all shadow-xl group relative overflow-hidden ${
                  foundKeys.size === totalKeys 
                    ? 'bg-white border-slate-100 hover:border-red-400 hover:-translate-y-2 cursor-pointer' 
                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {! (foundKeys.size === totalKeys) && (
                  <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border-2 border-slate-200 flex items-center gap-2 transform -rotate-3">
                      <Zap size={16} className="text-yellow-500" />
                      <span className="text-xs font-black text-slate-600">지도를 먼저 완성해!</span>
                    </div>
                  </div>
                )}
                <Sword className={`${foundKeys.size === totalKeys ? 'text-red-500' : 'text-slate-400'} mb-4 group-hover:scale-125 transition-transform`} size={40} />
                <h3 className="text-2xl font-black mb-1 text-slate-900">2. 두목님과 대결 (연습)</h3>
                <p className="text-slate-500 font-bold">공부했나요? 이제 실전 대결로 넘어가요!</p>
              </button>
            </div>
          </div>
        )}

        {/* 이론 공부 */}
        {view === 'theory' && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-blue-200 shadow-lg flex justify-between items-center px-8">
              <h2 className="text-2xl font-black text-blue-600">키보드 보물 찾기 🗺️</h2>
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-500">발견한 보물: {foundKeys.size} / {totalKeys}</span>
                <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${(foundKeys.size / totalKeys) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-blue-100 overflow-hidden">
                <p className="text-center font-bold text-slate-500 mb-6">"실제 키보드에서 아래 버튼들을 찾아 눌러보세요!"</p>
                <img src={KEY_EXPLANATION_IMG} alt="Key Guide" className="w-full rounded-2xl shadow-inner border-2 border-slate-100" />
            </div>

            <div className="grid gap-6">
              {KEYBOARD_THEORY.map(section => (
                <div key={section.id} className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-slate-50 overflow-hidden relative">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" /> {section.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {section.keys.map(k => {
                      const isFound = foundKeys.has(k.name);
                      return (
                        <div 
                          key={k.name} 
                          className={`flex gap-4 p-5 rounded-3xl border-4 transition-all duration-300 ${
                            isFound 
                              ? 'bg-green-50 border-green-400 scale-[1.02] shadow-md' 
                              : 'bg-slate-50 border-transparent hover:border-blue-200'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl shadow-md border-2 flex items-center justify-center font-black text-xs uppercase shrink-0 transition-colors ${
                            isFound ? 'bg-white border-green-200 text-green-600' : 'bg-white border-slate-200 text-blue-600'
                          }`}>
                            {k.name.split(' ')[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={`font-black flex items-center gap-1 ${isFound ? 'text-green-700' : 'text-slate-800'}`}>
                                {k.icon} {k.name}
                              </p>
                              {isFound && <CheckCircle2 className="text-green-500 animate-bounce" size={20} />}
                            </div>
                            <p className="text-sm text-slate-500 mt-1 font-bold leading-relaxed">{k.desc}</p>
                            {!isFound && (
                              <div className="mt-2 text-[10px] font-black text-blue-400 bg-blue-50 py-1 px-2 rounded-lg inline-block animate-pulse">
                                지금 키보드에서 눌러보세요!
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-6">
              <button 
                onClick={() => foundKeys.size === totalKeys ? startLevel(0) : null} 
                disabled={foundKeys.size !== totalKeys}
                className={`px-12 py-5 rounded-[30px] font-black text-2xl shadow-xl transition-all relative overflow-hidden ${
                  foundKeys.size === totalKeys 
                    ? 'bg-green-500 hover:bg-green-600 text-white animate-bounce hover:scale-105 cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-8 border-slate-300'
                }`}
              >
                {foundKeys.size !== totalKeys && (
                  <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center">
                    <div className="bg-white/90 px-3 py-1 rounded-full shadow-sm border border-slate-200 flex items-center gap-1 scale-75">
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-[10px] font-black text-slate-600">모든 보물을 찾아야 대결할 수 있어!</span>
                    </div>
                  </div>
                )}
                {foundKeys.size === totalKeys ? '충분히 익혔어요! 대결 시작!' : '보물을 모두 찾아보세요!'}
              </button>
            </div>
          </div>
        )}

        {/* 게임 화면 */}
        {view === 'game' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-2xl mx-auto relative min-h-[600px] flex flex-col justify-center">
            
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-[50px] opacity-20 blur-[2px]">
              <img src={STAGES[currentStage].bg} alt="Background" className="w-full h-full object-cover" />
            </div>

            {gameState.viewMode === 'dialogue' ? (
              <div className="bg-white/90 backdrop-blur-md rounded-[50px] p-12 shadow-2xl border-4 border-yellow-400 flex flex-col items-center justify-center space-y-12 animate-in slide-in-from-bottom-12 duration-500">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <img 
                      src={
                        STAGES[currentStage].dialogue[currentDialogueIdx].speaker === 'SHIN' ? SHIN_IMG :
                        STAGES[currentStage].dialogue[currentDialogueIdx].speaker === 'MOM' ? MOM_IMG :
                        STAGES[currentStage].dialogue[currentDialogueIdx].speaker === 'DAD' ? DAD_IMG :
                        STAGES[currentStage].dialogue[currentDialogueIdx].speaker === 'ACTION' ? ACTION_MASK_IMG :
                        VILLAIN_IMG
                      } 
                      alt="Speaker" 
                      className="w-32 h-32 drop-shadow-xl animate-pulse"
                    />
                    <div className="absolute -top-8 -left-4 bg-yellow-400 text-white px-4 py-1.5 rounded-full font-black text-base border-2 border-white shadow-md whitespace-nowrap min-w-max">
                      {STAGES[currentStage].dialogue[currentDialogueIdx].speaker}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-10 rounded-3xl border-4 border-slate-100 w-full relative">
                  <p className="text-2xl font-black text-slate-800 text-center leading-relaxed">
                    "{STAGES[currentStage].dialogue[currentDialogueIdx].text}"
                  </p>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 border-l-4 border-t-4 border-slate-100 rotate-45"></div>
                </div>

                <button 
                  onClick={() => {
                    if (currentDialogueIdx < STAGES[currentStage].dialogue.length - 1) {
                      setCurrentDialogueIdx(prev => prev + 1);
                    } else {
                      setGameState(prev => ({ ...prev, viewMode: 'play' }));
                    }
                  }}
                  className="bg-yellow-500 text-white px-10 py-4 rounded-full font-black text-xl shadow-xl hover:bg-yellow-600 transition-all flex items-center gap-2 group active:scale-95"
                >
                  {currentDialogueIdx < STAGES[currentStage].dialogue.length - 1 ? '다음 대화' : '미션 시작!'}
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <img src={STAGES[currentStage].level === '보스' ? VILLAIN_IMG : ACTION_MASK_IMG} alt="Guide" className="w-16 h-16 rounded-2xl shadow-xl border-4 border-white mb-2" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border-4 border-blue-400 relative shadow-md">
                      <div className="absolute -left-3 top-4 w-4 h-4 bg-white border-l-4 border-t-4 border-blue-400 rotate-[-45deg]"></div>
                      <p className="font-black text-blue-700 text-sm leading-tight italic">"{STAGES[currentStage].instruction}"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[50px] p-8 md:p-12 shadow-2xl border-b-[16px] border-slate-200 relative overflow-hidden">
                  
                  {gameState.showSuccessEffect && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-green-500/10 backdrop-blur-[2px] animate-in fade-in duration-300">
                      <div className="bg-white rounded-full p-6 shadow-2xl border-8 border-green-500 animate-in zoom-in duration-500">
                        <CheckCircle2 size={120} className="text-green-500 animate-pulse" />
                      </div>
                      <div className="absolute bottom-20 text-4xl font-black text-green-600 drop-shadow-md animate-bounce">
                         참 잘했어요!
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-6">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">Level {STAGES[currentStage].level} - Stage {STAGES[currentStage].id}</span>
                  </div>

                  <div className="text-center space-y-10">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">{STAGES[currentStage].title}</h3>
                        <p className="text-lg font-bold text-yellow-600">{STAGES[currentStage].instruction}</p>
                        
                        {/* 보스 스테이지용 마스터 키 트래커 */}
                        {STAGES[currentStage].requiredKeyList && (
                            <div className="flex justify-center gap-3 mt-4">
                                {STAGES[currentStage].requiredKeyList.map(k => {
                                    const isUsed = gameState.usedKeys.includes(k);
                                    return (
                                        <div key={k} className={`px-4 py-2 rounded-2xl border-4 transition-all duration-300 flex items-center gap-2 ${
                                            isUsed ? 'bg-green-100 border-green-500 text-green-700 scale-110 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-50'
                                        }`}>
                                            {isUsed ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                                            <span className="font-black text-sm">{k}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                      </div>

                    <div className="min-h-[140px] flex flex-col justify-center items-center">
                      {STAGES[currentStage].type === 'typing' ? (
                        <div className="space-y-4">
                          <div className="text-7xl font-black text-slate-900 tracking-tight drop-shadow-sm">
                            {STAGES[currentStage].targets[gameState.targetIdx]}
                          </div>
                          <div className="flex justify-center gap-2">
                            {STAGES[currentStage].targets.map((_, i) => (
                              <div key={i} className={`w-3 h-3 rounded-full ${i === gameState.targetIdx ? 'bg-yellow-500 w-10' : i < gameState.targetIdx ? 'bg-green-400' : 'bg-slate-200'} transition-all duration-300`} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-3xl font-black text-slate-700 bg-slate-50 p-8 rounded-[35px] border-4 border-dashed border-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner selectable-text select-text">
                            {STAGES[currentStage].targetText || STAGES[currentStage].text}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      {/* 기존 토스트 에러 삭제 (모달로 대체됨) */}

                      <div className={`absolute -top-12 left-6 flex gap-2 transition-all ${gameState.isCtrlPressed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <div className="bg-blue-600 text-white px-5 py-1.5 rounded-xl font-black text-sm shadow-lg border-2 border-white">Ctrl 기술 발동!</div>
                      </div>

                      {STAGES[currentStage].targetAction === 'copy' ? (
                        <div className="w-full py-12 px-6 bg-blue-50/50 rounded-[45px] border-4 border-dashed border-blue-200 flex flex-col items-center justify-center gap-4 animate-pulse">
                            <Copy className="text-blue-400" size={48} />
                            <p className="text-xl font-black text-blue-600">위 문장을 드래그해서 Ctrl+C를 눌러주세요!</p>
                        </div>
                      ) : STAGES[currentStage].type === 'typing' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={gameState.input}
                          onChange={handleInputChange}
                          onMouseDown={handleMouseDown}
                          disabled={gameState.completed}
                          autoFocus
                          spellCheck={false}
                          className={`w-full text-4xl p-10 rounded-[45px] border-[6px] transition-all text-center outline-none shadow-inner font-black ${gameState.completed
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : gameState.showError ? 'border-red-500 bg-red-50 shake' : 'border-slate-100 focus:border-yellow-400 bg-slate-50 focus:bg-white'
                            }`}
                          placeholder="여기에 입력!"
                        />
                      ) : (
                        <textarea
                          ref={inputRef}
                          value={gameState.input}
                          onChange={handleInputChange}
                          onMouseDown={handleMouseDown}
                          disabled={gameState.completed}
                          autoFocus
                          spellCheck={false}
                          className={`w-full text-3xl p-8 rounded-[35px] border-[6px] transition-all text-center outline-none shadow-inner font-black h-40 resize-none leading-relaxed ${gameState.completed
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : gameState.showError ? 'border-red-500 bg-red-50 shake' : 'border-slate-100 focus:border-yellow-400 bg-slate-50 focus:bg-white'
                            }`}
                          placeholder="미션 수행 중..."
                        />
                      )}
                    </div>
                  </div>

                  {gameState.completed && (
                    <div className="absolute inset-0 bg-yellow-400/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 p-8 text-center z-50 rounded-[50px]">
                      {currentStage === STAGES.length - 1 ? (
                        <div className="space-y-6">
                           <img src={FINAL_CELEBRATION_IMG} alt="Together" className="w-[450px] h-auto mb-4 rounded-3xl shadow-2xl border-8 border-white animate-bounce" />
                           <div className="bg-slate-900 text-white px-10 py-4 rounded-[25px] font-black text-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-700">🏆 떡잎마을 키보드 수호대 탄생!</div>
                        </div>
                      ) : (
                        <>
                          <img src={ACTION_MASK_IMG} alt="Happy" className="w-56 h-56 mb-4 animate-bounce" />
                          <h3 className="text-6xl font-black text-white mb-2 italic drop-shadow-lg tracking-tighter">"으하하! 미션 성공!"</h3>
                          <p className="text-2xl text-yellow-900 font-bold mb-10">다음 단계로 넘어가보자!</p>
                        </>
                      )}

                      <div className="flex gap-4 mt-8">
                        {currentStage < STAGES.length - 1 ? (
                          <button
                            onClick={() => startLevel(currentStage + 1)}
                            className="bg-white text-yellow-600 px-12 py-6 rounded-[30px] font-black text-3xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-2xl active:scale-95 border-b-8 border-slate-200"
                          >
                            다음 단계 <ArrowRight size={32} />
                          </button>
                        ) : (
                          <div className="space-y-6">
                            <button
                              onClick={() => setView('main')}
                              className="bg-white text-slate-900 px-12 py-6 rounded-[30px] font-black text-3xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-2xl mx-auto border-b-8 border-slate-200"
                            >
                              처음으로 <RotateCcw size={32} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-2 overflow-x-auto py-4">
              {STAGES.map((s, i) => (
                <div key={i} className={`h-3 rounded-full transition-all duration-700 shrink-0 ${i === currentStage ? 'w-12 bg-yellow-500 shadow-lg' : (i < currentStage ? 'bg-green-400 w-4' : 'w-4 bg-slate-200')}`} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 키보드 지도 모달 */}
      {gameState.showKeyboardMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-5xl w-full overflow-hidden border-4 border-blue-400 animate-in zoom-in-95 duration-300">
            <div className="bg-blue-400 p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <Keyboard /> 키보드 마법 지도
              </h3>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, showKeyboardMap: false }))}
                className="hover:scale-125 transition-transform"
              >
                <X size={28} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="rounded-2xl border-4 border-slate-100 overflow-hidden shadow-inner">
                <img src={KEY_EXPLANATION_IMG} alt="Keyboard Map" className="w-full" />
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                <p className="text-blue-800 font-bold text-center leading-relaxed">
                  "각 버튼의 이름과 기능을 잘 기억해 둬!<br />지도를 잘 보면 적들을 쉽게 물리칠 수 있어."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 시스템 알림 모달 (에러/안내) */}
      {gameState.showError && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden border-4 border-red-400 animate-in zoom-in-95 duration-300">
            <div className="bg-red-500 p-6 flex justify-center items-center text-white">
               <Zap size={48} className="animate-pulse" />
            </div>
            <div className="p-8 text-center space-y-6">
               <h3 className="text-2xl font-black text-slate-800 break-keep leading-relaxed">
                 {gameState.message || "정확한 키를 사용하세요!"}
               </h3>
               <button
                 onClick={() => setGameState(prev => ({ ...prev, showError: false }))}
                 className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
               >
                 확인
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}