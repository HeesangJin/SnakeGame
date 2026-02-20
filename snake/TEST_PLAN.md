# Snake UI Test Checklist

기준 문서: `snake/UI_DESIGN.md`  
검증 대상: `index.html`, `snake/app.js`

## 1. Overall Theme & Layout

- [x] 전체 화면 중앙 정렬 (`body`에 grid + `place-items: center`)
  - 확인 코드: `index.html`
- [x] 배경색이 오프화이트/라이트 그레이 톤 (`#f8f9fa`)
  - 확인 코드: `index.html`
- [ ] 모바일/데스크탑에서 중앙 정렬이 깨지지 않음
  - 확인 방법: 브라우저 반응형 모드 실측

## 2. Scoreboard

- [x] Score/Best가 보드 상단 하나의 카드 레이아웃으로 배치됨
  - 확인 코드: `index.html`
- [x] 카드에 `border-radius` 및 `box-shadow` 적용
  - 확인 코드: `index.html`
- [x] 숫자 폰트가 크고 굵게 표시됨 (`font-size: 1.5rem`, `font-weight: 900`)
  - 확인 코드: `index.html`

## 3. Game Board

- [x] 보드 테두리 두께/색상/라운드 적용 (`2px`, `#E9ECEF` 계열, `10px`)
  - 확인 코드: `index.html`
- [x] 그리드 라인이 낮은 opacity로 표시됨 (`rgba(0,0,0,0.03)`)
  - 확인 코드: `index.html`
- [x] 스네이크 블록 라운드 처리 (`border-radius: 4px`)
  - 확인 코드: `index.html`
- [x] 스네이크 머리 색상 분리 (`snake-head` 클래스)
  - 확인 코드: `index.html`, `snake/app.js`
- [x] 음식이 원형 + glow 효과로 표시됨 (`border-radius: 50%`, `box-shadow`)
  - 확인 코드: `index.html`, `snake/app.js`

## 4. Controls & Buttons

- [x] Pause/Restart 버튼 기본 브라우저 스타일 제거 및 플랫 디자인 적용
  - 확인 코드: `index.html`
- [x] 버튼에 패딩/전환 효과 적용 (`transition: all 0.2s ease`)
  - 확인 코드: `index.html`
- [x] hover/active 상태 적용 (hover 색상 변화, active `scale(0.95)`)
  - 확인 코드: `index.html`
- [x] D-pad가 CSS Grid 십자 레이아웃으로 배치됨
  - 확인 코드: `index.html`
- [x] D-pad 버튼이 화살표 아이콘(↑↓←→)을 사용함
  - 확인 코드: `index.html`

## 5. Game Over State (UX)

- [x] 게임 오버 시 보드 위 반투명 어두운 오버레이 표시 (`rgba(0,0,0,0.5)`)
  - 확인 코드: `index.html`, `snake/app.js`
- [x] 오버레이 중앙에 `GAME OVER` 텍스트 표시
  - 확인 코드: `index.html`
- [x] 오버레이 내 Restart 버튼 제공 및 동작 연결
  - 확인 코드: `index.html`, `snake/app.js`
- [ ] 게임 오버 전/후 오버레이 전환 애니메이션이 시각적으로 자연스러움
  - 확인 방법: 실제 플레이 후 체감 테스트

## 6. Typography

- [x] 전체 폰트를 라운드 산세리프(`Nunito`)로 변경
  - 확인 코드: `index.html`
- [ ] 폰트 로딩 실패 시 폴백 폰트 가독성 확인
  - 확인 방법: 네트워크 차단 상태에서 수동 확인

## 7. Basic Interaction Sanity

- [x] 키보드 조작(Arrow/WASD) 유지
  - 확인 코드: `snake/app.js`
- [x] Space(일시정지), R(재시작) 동작 유지
  - 확인 코드: `snake/app.js`
- [x] 기존 Pause/Restart 버튼 동작 유지
  - 확인 코드: `snake/app.js`

## Execution Notes

- 이번 체크리스트의 `[x]`는 코드 반영 여부 기준으로 확인함.
- 브라우저 실행이 필요한 항목은 `[ ]`로 남겨 수동 QA 대상으로 분리함.
