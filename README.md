# Klipto Sports website

Static HTML, CSS and vanilla JavaScript website. No build step or framework is required.

## Deploy to GitHub Pages

1. Open the `klipto-sports` GitHub repository.
2. Upload the **contents of this `klipto/` folder** to the repository's publishing root (the files such as `index.html`, `style.css`, `script.js`, `config.js`, and the `assets/` directory should sit beside one another).
3. In **Settings → Pages**, choose the branch and root (`/`) used by the repository, then save.
4. Wait for the Pages deployment to finish and open `https://kliptosports.github.io/klipto-sports/`.

The project uses relative paths, so it supports the repository subpath on GitHub Pages.

## Business settings

Edit `config.js` to update the email address, WhatsApp number, location, social links and Formspree endpoints. Quote and contact forms use the existing Formspree endpoints. Keep the endpoints configured in `config.js`; submissions require those forms to remain active in Formspree.

## Product imagery

Existing supplied product photographs are retained. Customer-supplied apparel photographs are stored in `assets/images/products/apparel/customer-products/` as optimized WebP files. The images are classified as leather-style, denim-style, puffer, varsity-style, crewneck sweatshirt and wide-leg sweatpants. Sports glove, boxing glove, MMA glove and hosiery categories remain unpopulated until genuine photographs are supplied. Existing glove photographs are identified as motorbike gloves and are not presented as boxing or MMA product images. Add approved product imagery to those categories when it becomes available.

## Local preview

Open `index.html` in a browser, or run a simple static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.
