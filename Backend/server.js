import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import Log from '../Logging_Middleware/Logging.mjs';

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

// In-memory data store for shortened URLs
const urlDatabase = new Map();

// Regex to validate a URL
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

// Helper function to generate a unique shortcode
const generateUniqueShortcode = () => {
    let shortcode;
    do {
        shortcode = Math.random().toString(36).substring(2, 9);
    } while (urlDatabase.has(shortcode));
    return shortcode;
};

// API Endpoint: Create Short URL
app.post('/shorturls', async (req, res) => {
    const { url, validity, shortcode } = req.body;
    const defaultValidity = 30; // Default validity in minutes

    // 1. Input Validation
    if (!url || !urlRegex.test(url)) {
        await Log("backend", "error", "handler", "Invalid URL provided.");
        return res.status(400).json({ error: 'Invalid URL. Please provide a valid URL.' });
    }

    // Check if a custom shortcode is provided and is valid
    if (shortcode) {
        if (!/^[a-zA-Z0-9]{4,10}$/.test(shortcode)) {
            await Log("backend", "error", "handler", "Invalid custom shortcode format.");
            return res.status(400).json({ error: 'Invalid custom shortcode. It must be alphanumeric and 4-10 characters long.' });
        }
        if (urlDatabase.has(shortcode)) {
            await Log("backend", "warn", "handler", `Custom shortcode collision: ${shortcode}`);
            return res.status(409).json({ error: 'Custom shortcode already in use. Please choose another one.' });
        }
    }

    // 2. Shortcode Generation & Expiry Calculation
    const finalShortcode = shortcode || generateUniqueShortcode();
    const expiryMinutes = validity && typeof validity === 'number' ? validity : defaultValidity;
    const expiryDate = new Date(Date.now() + expiryMinutes * 60000); // 60000 ms in a minute

    // 3. Data Storage
    const shortLink = `http://localhost:${PORT}/${finalShortcode}`;
    urlDatabase.set(finalShortcode, {
        originalUrl: url,
        shortLink: shortLink,
        creationDate: new Date(),
        expiryDate: expiryDate.toISOString(),
        clicks: [],
    });

    // 4. Logging & Response
    await Log("backend", "info", "service", `URL shortened. Code: ${finalShortcode}`);
    res.status(201).json({
        shortlink: shortLink,
        expiry: expiryDate.toISOString(),
    });
});

// API Endpoint: Retrieve URL Statistics
app.get('/shorturls/:shortcode', async (req, res) => {
    const { shortcode } = req.params;

    const urlData = urlDatabase.get(shortcode);

    if (!urlData) {
        await Log("backend", "error", "handler", `Stats requested for non-existent code: ${shortcode}`);
        return res.status(404).json({ error: 'Shortcode not found.' });
    }

    await Log("backend", "info", "service", `Stats retrieved for shortcode: ${shortcode}`);
    res.status(200).json({
        originalUrl: urlData.originalUrl,
        shortlink: urlData.shortLink,
        creationDate: urlData.creationDate,
        expiryDate: urlData.expiryDate,
        totalClicks: urlData.clicks.length,
        clickDetails: urlData.clicks,
    });
});

// API Endpoint: Redirection
app.get('/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    const urlData = urlDatabase.get(shortcode);
    const now = new Date();

    if (!urlData) {
        await Log("backend", "error", "handler", `Redirect attempt for non-existent code: ${shortcode}`);
        return res.status(404).send('Shortcode not found.');
    }

    const expiryDate = new Date(urlData.expiryDate);
    if (now > expiryDate) {
        await Log("backend", "error", "handler", `Redirect attempt for expired code: ${shortcode}`);
        return res.status(410).send('Shortlink has expired.');
    }

    const clickInfo = {
        timestamp: now.toISOString(),
        source: req.get('Referer') || 'Direct',
        location: req.ip,
    };
    urlData.clicks.push(clickInfo);

    await Log("backend", "info", "service", `Successful redirect for code: ${shortcode}`);
    res.redirect(302, urlData.originalUrl);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    Log("backend", "info", "service", `Server started on port ${PORT}.`);
});