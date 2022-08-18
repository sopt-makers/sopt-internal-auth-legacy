const backgroundColor = "#8040FF";

const buttonStyle = `
background-color: ${backgroundColor};
color: white;
width: 420px;
height: 48px;
display: inline-block;
line-height: 48px;
text-decoration: none;
font-size: 16px;
border-radius: 6px;
`;

export function createRegisterEmailHTML(data: { name: string; token: string; registerPageUriTemplate: string }) {
  const registerPageUri = encodeURI(data.registerPageUriTemplate.replace("{{token}}", data.token));

  return `
        <div style="text-align:center;font-weight:400;">
            <br><br><br>
            <h1 style="font-size: 32px;">SOPT 회원인증 완료</h1>
            <p style="font-size: 16px;">SOPT 회원인증을 위한 메일입니다.<br>아래의 버튼을 눌러 회원가입 절차를 계속 진행해주세요.</p>
            <br>
            <a href="${registerPageUri}" target="_blank" style="${buttonStyle}">회원가입 계속하기</a>
            <br><br>
        </div>
    `;
}
