# CodeCraft — Beginner Website Development Resource

*Learn to Code. Build with Confidence.*

A complete 10-page educational website built with HTML5, CSS3 and a small amount of vanilla JavaScript. No frameworks, build tools or server are required.

## How to open it

1. Unzip the folder (if you received a zip file).
2. Double-click `index.html` to open the site in your browser.
3. Use the navigation bar to move between pages.

Fonts (Poppins, Inter, JetBrains Mono) load from Google Fonts. Offline, your browser shows fallback fonts and everything else works normally.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `getting-started.html` | Getting Started |
| `html-tutorial.html` | Learn HTML |
| `css-tutorial.html` | Learn CSS |
| `roadmap.html` | Learning Roadmap |
| `projects.html` | Beginner Projects |
| `resources.html` | Resources & Tools |
| `faq.html` | FAQ |
| `contact.html` | Contact & Feedback (demonstration form) |

## Project structure

```text
CodeCraft/
├── index.html … contact.html    (10 pages)
├── css/
│   ├── style.css                (design tokens, components)
│   ├── responsive.css           (breakpoints, mobile menu)
│   └── effects.css              (hover, dropdown, scroll animations)
├── js/
│   └── script.js                (menus, scroll effects, tracker, filter, demo form)
└── assets/
    └── images/                  (no external images; illustrations are inline SVG)
```

## Notes

- **Contact form:** it is a demonstration. It validates input but sends nothing, because no backend is configured. To make it work, connect a form service and set the form's `action`.
- **External links:** the Resources page links to official third-party sites. Check them occasionally as sites change.
- **Accessibility:** skip link, visible focus states, semantic landmarks, labelled form fields, reduced-motion support and keyboard-friendly menus and accordions.
- **Customizing:** colors and fonts are CSS variables at the top of `css/style.css`.

## Interactive features

- **Buttons:** colour shift, sliding arrow, lift, glowing shadow and a light sweep on hover.
- **Links:** highlight sweep on text links, arrows that slide on card links, underline that grows in the menu.
- **Dropdown menus (Learn, Explore):** open on hover, click/tap or keyboard; close smoothly, on Escape, or when you click elsewhere.
- **Scroll effects:** fade-and-rise reveals with staggered timing, a reading-progress bar, a header shadow, a back-to-top button and counting numbers.
- **Roadmap tracker:** tick stages as you finish them. Progress is saved in your browser only.
- **Project filter:** show Easy or Medium projects only.
- **Code windows:** a Copy button on every example.
- **Reduced motion:** all animation is turned off for visitors who ask for it in their system settings.
