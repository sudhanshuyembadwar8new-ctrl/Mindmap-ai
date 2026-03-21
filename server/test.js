async function testEndpoints() {
  const baseURL = 'http://localhost:5001/api';
  let token = '';
  let mapId = '';
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  console.log('--- STARTING TESTS ---');
  
  async function request(url, method, body, headers = {}) {
    const res = await fetch(`${baseURL}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw { status: res.status, data };
    return data;
  }

  try {
    console.log('\n1. POST /api/auth/signup');
    const resSignup = await request('/auth/signup', 'POST', {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    });
    console.log('Signup success:', resSignup);
    token = resSignup.token;
  } catch (err) {
    console.error('Signup failed:', err);
  }

  try {
    console.log('\n2. POST /api/auth/login');
    const resLogin = await request('/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log('Login success:', resLogin);
    token = resLogin.token || token;
  } catch (err) {
    console.error('Login failed:', err);
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  try {
    console.log('\n3. GET /api/auth/me');
    const resMe = await request('/auth/me', 'GET', null, authHeaders);
    console.log('Me success:', resMe);
  } catch (err) {
    console.error('Me failed:', err);
  }

  try {
    console.log('\n4. POST /api/generate');
    const resGen = await request('/generate', 'POST', { topic: 'Artificial Intelligence' }, authHeaders);
    console.log('Generate success:', resGen);
  } catch (err) {
    console.error('Generate failed:', err);
  }

  try {
    console.log('\n5. POST /api/expand');
    const resExp = await request('/expand', 'POST', { nodeId: 'test', nodeLabel: 'AI', context: 'Artificial Intelligence' }, authHeaders);
    console.log('Expand success:', resExp);
  } catch (err) {
    console.error('Expand failed:', err);
  }

  try {
    console.log('\n6. POST /api/chat');
    const resChat = await request('/chat', 'POST', { messages: [{role:'user', content:'hello'}], context: 'AI' }, authHeaders);
    console.log('Chat success:', resChat);
  } catch (err) {
    console.error('Chat failed:', err);
  }

  try {
    console.log('\n7. POST /api/import');
    const resImport = await request('/import', 'POST', { content: 'AI is a field of computer science' }, authHeaders);
    console.log('Import success:', resImport);
  } catch (err) {
    console.error('Import failed:', err);
  }

  try {
    console.log('\n8. POST /api/maps');
    const resMap = await request('/maps', 'POST', { title: 'Test Map', data: '{"nodes":[]}' }, authHeaders);
    console.log('Create map success:', resMap);
    mapId = resMap._id;
  } catch (err) {
    console.error('Create map failed:', err);
  }

  try {
    console.log('\n9. GET /api/maps');
    const resMaps = await request('/maps', 'GET', null, authHeaders);
    console.log('Get maps success:', resMaps);
  } catch (err) {
    console.error('Get maps failed:', err);
  }

  if (mapId) {
    try {
      console.log('\n10. POST /api/maps/share/:id');
      const resShare = await request(`/maps/share/${mapId}`, 'POST', { isPublic: true }, authHeaders);
      console.log('Share map success:', resShare);
    } catch (err) {
      console.error('Share map failed:', err);
    }

    try {
      console.log('\n11. DELETE /api/maps/:id');
      const resDel = await request(`/maps/${mapId}`, 'DELETE', null, authHeaders);
      console.log('Delete map success:', resDel);
    } catch (err) {
      console.error('Delete map failed:', err);
    }
  }
}

testEndpoints();
