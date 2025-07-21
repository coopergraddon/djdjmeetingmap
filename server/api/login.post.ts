export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const password = body.password;
  const sitePassword = process.env.SITE_PASSWORD;
  if (password && password === sitePassword) {
    setCookie(event, 'auth', '1', { path: '/', httpOnly: false });
    return { success: true };
  } else {
    return { success: false, error: 'Incorrect password' };
  }
}); 