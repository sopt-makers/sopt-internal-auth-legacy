export function createRegisterEmailHTML(data: { name: string; token: string; registerPageUriTemplate: string }) {
  const registerPageUri = encodeURI(data.registerPageUriTemplate.replace("{{token}}", data.token));

  return `
        <div>
            <h1>SOPT</h1>
            <p>안녕하세요, ${data.name} 님!</p>
            <a href="${registerPageUri}" target="_blank">SOPT 회원가입</a>
        </div>
    `;
}
