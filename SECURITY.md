# Security Policy

## Supported Versions

The following versions of the Neuro-Chemistry of Love dashboard are currently receiving security updates.

| Version | Supported          |
| ------- | ------------------ |
| 2026.x  | :white_check_mark: |
| 2025.x  | :x:                |

## Reporting a Vulnerability

We take the security of this project seriously. If you find a security vulnerability, please do not disclose it publicly.

To report a vulnerability:
1. Contact the lead developer or security team directly (if applicable).
2. Provide a detailed description of the vulnerability.
3. Include steps to reproduce the issue.

We will acknowledge your report within 48 hours and provide a timeline for a potential fix.

## AI & Data Security

This application utilizes the Google Gemini API. Please be aware of the following:
- **API Keys**: This application retrieves the API key exclusively from the environment. Never hardcode keys in the source.
- **Privacy**: Input provided to the "Neuro-Bot" is processed by Google's generative models. Avoid sharing personally identifiable information (PII) or sensitive health data.
- **Grounding**: While we use Google Search grounding to ensure accuracy, AI-generated content should be verified against official medical or scientific publications before making health-related decisions.

## Third-Party Dependencies

We monitor dependencies for known vulnerabilities. If a critical vulnerability is found in a library (e.g., `@google/genai`, `recharts`), we will prioritize an update to the latest stable version.
