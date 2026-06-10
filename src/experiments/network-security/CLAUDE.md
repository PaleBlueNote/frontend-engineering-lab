# Section 9: 네트워크 & 보안

보안 취약점과 HTTP 동작을 직접 재현하며 이해한다.

## 핵심 개념

| 개념 | 핵심 |
|------|------|
| Same-Origin Policy | 프로토콜 + 호스트 + 포트 모두 같아야 same-origin |
| CORS | 서버가 허용한 출처의 cross-origin 요청만 허용. preflight(OPTIONS)로 사전 확인 |
| XSS | 악성 스크립트 주입. `innerHTML` 사용 시 위험 |
| HTTP/2 | 하나의 TCP 연결로 여러 요청 병렬 처리(multiplexing) |

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| CORS Preflight 시각화 | `./cors/` | ★★★ |
| XSS 공격과 방어 패턴 | `./xss/` | ★★★ |
| HTTP/1.1 vs HTTP/2 비교 | `./http2/` | ★★ |

## 주의사항

XSS 실험은 `localhost` 내에서만 시연. 악성 코드를 외부 도메인에 배포하지 않는다.

## 이 섹션 완료 후 면접 답변 가능 질문

- "CORS가 무엇인지, 왜 필요한지 설명하세요" → cors
- "Preflight 요청이 언제 발생하나요?" → cors
- "XSS란 무엇이고 어떻게 방어하나요?" → xss
- "HTTP/1.1과 HTTP/2의 차이는?" → http2
