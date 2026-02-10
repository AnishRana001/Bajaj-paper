require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const OFFICIAL_EMAIL = "anish1074.be23@chitkarauniversity.edu.in";

app.get("/health", (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL
    });
});

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lcmArray(arr) {
    let res = arr[0];
    for (let i = 1; i < arr.length; i++) {
        res = (res * arr[i]) / gcd(res, arr[i]);
    }
    return res;
}

function hcfArray(arr) {
    let res = arr[0];
    for (let i = 1; i < arr.length; i++) {
        res = gcd(res, arr[i]);
    }
    return res;
}

app.post("/bfhl", async (req, res) => {
    const body = req.body;

    if (!body || typeof body !== "object") {
        return res.status(400).json({ is_success: false });
    }

    const keys = Object.keys(body);
    if (keys.length !== 1) {
        return res.status(400).json({ is_success: false });
    }

    const key = keys[0];

    if (key === "fibonacci") {
        const n = body.fibonacci;

        if (typeof n !== "number" || n < 0) {
            return res.status(400).json({ is_success: false });
        }

        const result = [];
        let a = 0, b = 1;

        for (let i = 0; i < n; i++) {
            result.push(a);
            const t = a + b;
            a = b;
            b = t;
        }

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: result
        });
    }

    if (key === "prime") {
        const arr = body.prime;

        if (!Array.isArray(arr)) {
            return res.status(400).json({ is_success: false });
        }

        const result = arr.filter(
            n => typeof n === "number" && isPrime(n)
        );

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: result
        });
    }

    if (key === "lcm") {
        const arr = body.lcm;

        if (!Array.isArray(arr) || arr.length === 0) {
            return res.status(400).json({ is_success: false });
        }

        for (let n of arr) {
            if (typeof n !== "number" || n <= 0) {
                return res.status(400).json({ is_success: false });
            }
        }

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: lcmArray(arr)
        });
    }

    if (key === "hcf") {
        const arr = body.hcf;

        if (!Array.isArray(arr) || arr.length === 0) {
            return res.status(400).json({ is_success: false });
        }

        for (let n of arr) {
            if (typeof n !== "number" || n <= 0) {
                return res.status(400).json({ is_success: false });
            }
        }

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: hcfArray(arr)
        });
    }

    if (key === "AI") {
    const question = body.AI;

    if (typeof question !== "string" || question.length === 0) {
        return res.status(400).json({ is_success: false });
    }

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{
                            text: `Answer in exactly one word only. Do not add anything else. Question: ${question}`
                        }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                }
            }
        );

        let answer =
            response.data.candidates[0].content.parts[0].text.trim();

        answer = answer.split(/\s+/)[0];

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: answer
        });
    } catch (err) {
        return res.status(500).json({ is_success: false });
    }
}


    return res.status(400).json({ is_success: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
