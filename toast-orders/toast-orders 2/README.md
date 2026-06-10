# Toast Orders

A minimal two-screen restaurant order system: a **Cashier** screen for taking orders and a **Kitchen** display that updates in real time. Built with Next.js + Vercel Postgres. White background, black lettering.

- `/cashier` — tap menu items, add a customer name, send to kitchen
- `/kitchen` — sees incoming orders live (polls every 3s), tap **Complete** to clear

## 1. Edit your menu

Open `lib/menu.js` and replace the 6 placeholder names with your real items. Keep the categories (Salty / Sweet / Beverage). Don't change the `id` values unless you also clear old orders.

## 2. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New Project** → import the repo.
3. Before/after the first deploy, add a database:
   - In the project, open the **Storage** tab → **Create Database** → **Postgres**.
   - Connect it to the project. Vercel automatically adds the `POSTGRES_*` environment variables.
4. Redeploy (Vercel does this automatically when the DB is connected).

The `orders` table is created automatically on first request — no migrations to run.

## 3. Use it

- Open `your-app.vercel.app/cashier` on the front-counter device.
- Open `your-app.vercel.app/kitchen` on the kitchen screen.
- Both work on any device with a browser; just bookmark the two URLs.

## Local development

```bash
npm install
# create .env.local with your POSTGRES_URL (pull from Vercel: `vercel env pull`)
npm run dev
```

## Notes

- The kitchen polls every 3 seconds. To change that, edit the `3000` value in `app/kitchen/page.js`.
- Completed orders are kept in the database (status `done`) but hidden from the kitchen. You can query them later for daily totals.
