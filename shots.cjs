const { chromium } = require('playwright');
const fs = require('fs');
const B = 'http://localhost:4174/#/';
(async () => {
  fs.mkdirSync('shots', { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  const go = async (r, w, name, act) => {
    await p.setViewportSize({ width: w, height: 1000 });
    await p.goto(B + r); await p.locator('h1').waitFor(); await p.waitForTimeout(400);
    if (act) { await act(); await p.waitForTimeout(400); }
    await p.screenshot({ path: `shots/${name}-${w}.png`, fullPage: true });
  };
  await go('overview', 1440, '01-overview'); await go('overview', 1920, '01-overview'); await go('overview', 390, '01-overview');
  await go('journey/M5', 1440, '02-journey');
  await go('programs', 1440, '03-portfolio'); await go('programs', 1024, '03-portfolio');
  for (const t of ['Thesis & fit', 'Interventions & milestones', 'Entry & exit', 'Outcomes & routing'])
    await go('program/dic', 1440, '04-dic-' + t.split(' ')[0], () => p.getByRole('button', { name: t, exact: true }).click());
  await go('gates/E3', 1440, '05-gate-E3', () => p.locator('.criterion summary').first().click());
  await go('gates/X3', 1440, '06-gate-X3');
  await go('simulator/E3', 1440, '07-sim', () => p.locator('.check-row select').first().selectOption('does-not-meet'));
  await go('simulator/E3', 1024, '07-sim', () => p.locator('.check-row select').first().selectOption('does-not-meet'));
  await go('routing/pre', 1440, '08-routing-pre', () => p.getByRole('button', { name: /Continue trace/ }).last().click());
  await go('routing/growth', 1440, '08-routing-growth');
  await go('kpis', 1440, '09-kpis', () => p.getByRole('button', { name: /Startup development/ }).click());
  await go('compare', 1440, '10-compare', async () => { for (const c of await p.locator('.compare-options input').all()) if (!(await c.isChecked())) await c.check(); });
  await go('overview', 1920, '11-present', () => p.getByRole('button', { name: 'Present', exact: true }).click());
  await b.close(); console.log('Done: see the shots folder');
})();