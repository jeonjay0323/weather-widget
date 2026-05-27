// iOS Scriptable Weather Widget - Polygon Typography
// 폴리곤 조형 스타일 날씨 위젯
//
// 설치: Scriptable 앱 → 이 스크립트 붙여넣기
// 위젯: 홈화면 → + → Scriptable → Medium 선택 → 이 스크립트 선택

const DIGIT_SHAPES = {
  1: [[[0,120],[72,120],[72,60],[0,60]],[[72,60],[82,120],[120,120],[120,60]],[[0,0],[0,48],[48,48],[60,0]],[[60,60],[72,60],[72,0],[60,0]]],
  2: [[[108,66],[120,66],[120,0],[108,0]],[[0,0],[0,48],[48,48],[60,0]],[[72,72],[60,120],[120,120],[120,72]],[[0,12],[120,12],[120,0],[0,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,66.4],[120,66.4],[120,54.4],[0,54.4]],[[0,120],[12,120],[12,54.4],[0,54.4]]],
  3: [[[0,0],[0,48],[48,48],[60,0]],[[0,72],[0,120],[60,120],[48,72]],[[0,12],[120,12],[120,0],[0,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,66.4],[120,66.4],[120,54.4],[0,54.4]],[[108,0],[120,0],[120,60],[108,60]],[[108,60],[120,60],[120,120],[108,120]]],
  4: [[[0,96],[84,96],[84,84],[0,84]],[[0,0],[36,0],[36,96],[0,96]],[[48,0],[84,0],[84,84],[48,84]],[[96,48],[84,96],[120,96],[120,48]],[[48,84],[84,84],[84,120],[48,120]]],
  5: [[[0,72],[0,120],[60,120],[48,72]],[[60,0],[72,48],[120,48],[120,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,12],[120,12],[120,0],[0,0]],[[0,65.6],[120,65.6],[120,53.6],[0,53.6]],[[108,54],[120,54],[120,120],[108,120]],[[0,0],[12,0],[12,65.6],[0,65.6]]],
  6: [[[60,0],[72,48],[120,48],[120,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,12],[120,12],[120,0],[0,0]],[[0,65.6],[120,65.6],[120,53.6],[0,53.6]],[[108,54],[120,54],[120,120],[108,120]],[[0,0],[12,0],[12,65.6],[0,65.6]],[[0,53.6],[66.4,53.6],[66.4,120],[0,120]]],
  7: [[[60,66.4],[120,66.4],[120,54.4],[60,54.4]],[[0,0],[0,48],[48,48],[60,0]],[[60,54.4],[36,120],[120,120],[120,54.4]],[[0,12],[120,12],[120,0],[0,0]],[[108,0],[120,0],[120,66],[108,66]]],
  8: [[[0,0],[12,0],[12,60],[0,60]],[[108,60],[120,60],[120,120],[108,120]],[[0,0],[0,60],[48,60],[60,0]],[[72,60.4],[60,120],[120,120],[120,60.4]],[[0,12],[120,12],[120,0],[0,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,66.4],[120,66.4],[120,54.4],[0,54.4]],[[108,0],[120,0],[120,60],[108,60]],[[0,60],[12,60],[12,120],[0,120]]],
  9: [[[0,12],[120,12],[120,0],[0,0]],[[0,66.4],[120,66.4],[120,54.4],[0,54.4]],[[0,0],[12,0],[12,66],[0,66]],[[53.6,0],[120,0],[120,66.4],[53.6,66.4]],[[60,54.4],[36,120],[120,120],[120,54.4]]],
  0: [[[0,12],[120,12],[120,0],[0,0]],[[0,120],[120,120],[120,108],[0,108]],[[0,0],[12,0],[12,120],[0,120]],[[48,0],[48,72],[120,36],[120,0]],[[48,84],[48,120],[120,120],[120,48]]]
};

function isNightTime(h) { return h < 6 || h >= 19; }

function getGradient(code, night) {
  if (night) return [new Color('#0c0c1d'), new Color('#1a1a3e')];
  if ([61,63,65,80,81,82,95,96,99].includes(code)) return [new Color('#2d3436'), new Color('#636e72')];
  if ([3,45,48].includes(code)) return [new Color('#636e72'), new Color('#b2bec3')];
  if ([71,73,75,77].includes(code)) return [new Color('#b2bec3'), new Color('#dfe6e9')];
  return [new Color('#74b9ff'), new Color('#a29bfe')];
}

async function getLocation() {
  try {
    Location.setAccuracyToKilometer();
    const loc = await Location.current();
    const geo = await Location.reverseGeocode(loc.latitude, loc.longitude);
    const name = geo[0]?.locality || geo[0]?.administrativeArea || '내 위치';
    return { lat: loc.latitude, lon: loc.longitude, name };
  } catch {
    return { lat: 37.5665, lon: 126.978, name: '서울' };
  }
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  const req = new Request(url);
  return await req.loadJSON();
}

function drawPolygonDigit(ctx, digit, x, y, size, color) {
  const shapes = DIGIT_SHAPES[digit];
  if (!shapes) return;
  const s = size / 120;
  ctx.setFillColor(color);
  for (const quad of shapes) {
    const path = new Path();
    path.move(new Point(x + quad[0][0]*s, y + quad[0][1]*s));
    path.addLine(new Point(x + quad[1][0]*s, y + quad[1][1]*s));
    path.addLine(new Point(x + quad[2][0]*s, y + quad[2][1]*s));
    path.addLine(new Point(x + quad[3][0]*s, y + quad[3][1]*s));
    path.closeSubpath();
    ctx.addPath(path);
    ctx.fillPath();
  }
}

function drawPolygonNumber(ctx, text, x, y, size, color) {
  let curX = x;
  const gap = size * 0.08;
  for (const ch of String(text)) {
    if (ch === '-') {
      const w = size * 0.5, h = size * 0.1;
      ctx.setFillColor(color);
      ctx.fillRect(new Rect(curX + w*0.1, y + size*0.45, w*0.8, h));
      curX += w + gap;
    } else if (ch === '°') {
      const r = size * 0.12;
      const cx = curX + r + 2, cy = y + size * 0.12;
      ctx.setStrokeColor(color);
      ctx.setLineWidth(size * 0.04);
      const path = new Path();
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        if (i === 0) path.move(new Point(px, py));
        else path.addLine(new Point(px, py));
      }
      path.closeSubpath();
      ctx.addPath(path);
      ctx.strokePath();
      curX += r * 2 + 6;
    } else {
      const d = parseInt(ch);
      if (!isNaN(d)) {
        drawPolygonDigit(ctx, d, curX, y, size, color);
        curX += size * 0.85 + gap;
      }
    }
  }
  return curX - x;
}

function createWidget(weather, locationName, family) {
  const w = new ListWidget();
  const now = new Date();
  const night = isNightTime(now.getHours());
  const cur = weather.current;
  const daily = weather.daily;
  const temp = Math.round(cur.temperature_2m);
  const feels = Math.round(cur.apparent_temperature);
  const hi = Math.round(daily.temperature_2m_max[0]);
  const lo = Math.round(daily.temperature_2m_min[0]);
  const colors = getGradient(cur.weather_code, night);

  w.backgroundGradient = new LinearGradient();
  w.backgroundGradient.locations = [0, 1];
  w.backgroundGradient.colors = colors;

  if (family === 'small') {
    // 정방형: 폴리곤 온도만 크게
    w.setPadding(0, 0, 0, 0);

    const size = 310;
    const dc = new DrawContext();
    dc.size = new Size(size, size);
    dc.opaque = false;
    dc.respectScreenScale = true;

    const digitSize = 100;
    const tempStr = temp + '°';
    // 대략적인 너비 계산
    let totalW = 0;
    for (const ch of tempStr) {
      if (ch === '°') totalW += digitSize * 0.3;
      else if (ch === '-') totalW += digitSize * 0.55;
      else totalW += digitSize * 0.85 + digitSize * 0.08;
    }
    const startX = (size - totalW) / 2;
    const startY = (size - digitSize) / 2;

    drawPolygonNumber(dc, tempStr, startX, startY, digitSize, Color.white());

    const img = dc.getImage();
    const stack = w.addStack();
    stack.layoutVertically();
    stack.addSpacer();
    const row = stack.addStack();
    row.addSpacer();
    const imgEl = row.addImage(img);
    imgEl.imageSize = new Size(155, 155);
    row.addSpacer();
    stack.addSpacer();

  } else {
    // Medium: 왼쪽 폴리곤 온도 + 오른쪽 정보
    w.setPadding(16, 16, 16, 16);

    const top = w.addStack();
    top.layoutHorizontally();
    top.centerAlignContent();

    // Left: polygon temp
    const leftSize = 200;
    const dc = new DrawContext();
    dc.size = new Size(leftSize, 120);
    dc.opaque = false;
    dc.respectScreenScale = true;

    const digitSize = 72;
    drawPolygonNumber(dc, temp + '°', 4, (120 - digitSize) / 2, digitSize, Color.white());

    const imgEl = top.addImage(dc.getImage());
    imgEl.imageSize = new Size(100, 60);

    top.addSpacer();

    // Right: info
    const right = top.addStack();
    right.layoutVertically();
    right.spacing = 3;

    const locT = right.addText(locationName);
    locT.font = Font.semiboldSystemFont(13);
    locT.textColor = Color.white();

    const rangeT = right.addText(`${hi}° / ${lo}°`);
    rangeT.font = Font.mediumSystemFont(12);
    rangeT.textColor = Color.white();
    rangeT.textOpacity = 0.65;

    const feelsT = right.addText(`체감 ${feels}°`);
    feelsT.font = Font.regularSystemFont(11);
    feelsT.textColor = Color.white();
    feelsT.textOpacity = 0.45;
  }

  return w;
}

async function main() {
  const loc = await getLocation();
  const weather = await getWeather(loc.lat, loc.lon);
  const family = config.widgetFamily || 'small';
  const widget = createWidget(weather, loc.name, family);

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    await widget.presentSmall();
  }
  Script.complete();
}

await main();
