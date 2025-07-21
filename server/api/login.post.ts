export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const password = body.password;
  const config = useRuntimeConfig();
  const sitePassword = config.SITE_PASSWORD;
  console.log('Loaded password:', sitePassword);
  if (password && password === sitePassword) {
    setCookie(event, 'auth', '1', { path: '/', httpOnly: false });
    return { success: true };
  } else {
    return { success: false, error: 'Incorrect password' };
  }
}); 