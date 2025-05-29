
# LaTeX Converter - ChatGPT to Obsidian

Link: [https://latex2obsidian.vercel.app](https://latex2obsidian.vercel.app)

A modern web application that converts ChatGPT-style LaTeX mathematical expressions to Obsidian-compatible MathJax format. Built with Next.js and Tailwind CSS.

## Features

- 🔄 Real-time LaTeX conversion
- 🌓 Dark/Light mode support
- 📋 One-click copy to clipboard
- ✨ Live preview
- 🎯 Supports various LaTeX environments:
  - Inline math (`$...$`)
  - Block math (`$$...$$`)
  - Aligned equations (`aligned` environment)
  - Matrices and arrays
  - Special environments (cases, matrix variants)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/latex-converter.git
   cd latex-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste your ChatGPT LaTeX code into the input area
2. The conversion happens automatically in real-time
3. Copy the converted LaTeX using the "Copy" button
4. Paste the converted LaTeX into your Obsidian note

### Example Conversions

#### Inline Math
```
Input:  $$x^2 + y^2 = r^2$$
Output: $x^2 + y^2 = r^2$
```

#### Block Math
```
Input: \[ \frac{d}{dx}(x^n) = nx^{n-1} \]
Output: $$\frac{d}{dx}(x^n) = nx^{n-1}$$
```

#### Aligned Equations
```
Input:
\begin{align}
f(x) &= x^2 \\
g(x) &= 2x
\end{align}

Output:
$$\begin{aligned}
f(x) &= x^2 \\
g(x) &= 2x
\end{aligned}$$
```

## Supported LaTeX Features

- Basic math operators and symbols
- Fractions and radicals
- Superscripts and subscripts
- Matrices and arrays
- Aligned equations
- Special environments (cases, matrix variants)
- Text within math mode

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need to easily convert ChatGPT's LaTeX output to Obsidian-compatible format
- Thanks to the MathJax community for their excellent documentation
