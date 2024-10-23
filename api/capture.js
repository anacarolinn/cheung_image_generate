const puppeteer = require("puppeteer");
const sharp = require("sharp");

export default async function handler(req, res) {
  const { vBars, hBars, dBars } = req.query;

  // Gera a URL com os parâmetros
  const url = `https://cheung-image-generate.vercel.app/?vBars=${vBars}&hBars=${hBars}&dBars=${dBars}`;

  try {
    // Inicia o Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Garantindo que será headless para funcionar no server
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necessário para Vercel
    });
    const page = await browser.newPage();

    // Navega até a URL com os parâmetros
    await page.goto(url, { waitUntil: "networkidle0" });

    // Tira o screenshot da página
    const screenshotBuffer = await page.screenshot();

    // Fecha o browser
    await browser.close();

    // Processa a imagem usando Sharp (opcionalmente redimensione)
    const processedImage = await sharp(screenshotBuffer)
      .resize({ width: 1000 }) // Aqui você pode ajustar o tamanho
      .png() // Define o formato da imagem
      .toBuffer();

    // Define o cabeçalho e envia a imagem como resposta
    res.setHeader("Content-Type", "image/png");
    res.send(processedImage);
  } catch (error) {
    console.error("Erro ao gerar a captura de tela:", error);
    res.status(500).send("Erro ao gerar a captura de tela");
  }
}
