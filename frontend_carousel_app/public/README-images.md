Place image assets for Create React App in this folder or a subfolder like /images.

Guidelines:
- Use absolute paths from the CRA public root when referencing: e.g., src="/images/phone.jpg"
- Prefer adding reliable external URLs as primary sources and local files as fallbacks for robustness.
- Example object in App.js:
  { src: "https://example.com/photo.jpg", fallback: "/images/photo.jpg", alt: "Descriptive alt text" }
