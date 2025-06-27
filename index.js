import express from "express";
import crypto from "crypto";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
let urlsMap = new Map();

// API Routes
app.post("/shorturls", async (req, res) => {
    let { url, validity, shortcode } = req.body;
    const pattern =
        /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    if (!url) return res.status(400).json({ error: "URL is required" });
    if (!pattern.test(url)) {
        return res.status(400).json({ error: "Invalid URL format" });
    }
    if (urlsMap.has(shortcode)) shortcode = null;
    const shortId = shortcode || crypto.randomBytes(3).toString("hex");
    const shortUrl = `http://localhost:${PORT}/${shortId}`;
    const createdAt = new Date();
    const expiryTime = new Date(createdAt.getTime() + validity * 60000);
    urlsMap.set(shortId, {
        url,
        shortUrl,
        createdAt: createdAt.toISOString(),
        expiryTime,
        validity,
        clicks: [],
    });
    return res.json({
        shortLink: shortUrl,
        expiry: expiryTime.toISOString(),
    });
});


app.get("/", (req, res) => {
    res.send("Hello there");
});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
