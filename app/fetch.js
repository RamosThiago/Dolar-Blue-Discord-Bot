// Funciones de fetch sobre la API de FinanzasArgy

export async function getCurrency(name) {
  try{
    const data = await getBlue();
    const currency = data.find(c => c.titulo === name);
    if (currency) {
      return currency;
    } else {
      console.log('Nombre no encontrado');
      return {};
    }
  } catch (error) {
    throw error;
  }
}

export async function lastNews() {
  const url = 'https://backend-ifa-production-a92c.up.railway.app/api/floating-news';
  const headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "es-419, es;q=0.7",
    "Api-Client": "finanzasargy",
    "If-None-Match": "W/\"b8d-LOUvw6UP8i04Q6Z2LxVCzwOKQRo\"",
    "Origin": "https://www.finanzasargy.com",
    "Priority": "u=1, i",
    "Referer": "https://www.finanzasargy.com/",
    "Sec-Ch-Ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?1",
    "Sec-Ch-Ua-Platform": "\"Android\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Gpc": "1",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"
    };

  try {
    const response = await fetch(url, {headers});
    if (!response.ok) {
      throw new Error(response.status);
  }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getBlue() {
  const url = 'https://backend-ifa-production-a92c.up.railway.app/api/mercado-blue';
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "es-419, es;q=0.5",
    "Api-Client": "finanzasargy",
    "Cache-Control": "no-cache",
    "Origin": "https://www.finanzasargy.com",
    "Pragma": "no-cache",
    "Priority": "u=1, i",
    "Referer": "https://www.finanzasargy.com/",
    "Sec-Ch-Ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?1",
    "Sec-Ch-Ua-Platform": "\"Android\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Gpc": "1",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"
    };

  try {
    const response = await fetch(url, {headers});
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};