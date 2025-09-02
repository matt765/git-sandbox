<div id="user-content-toc" align="center">
<ul align="center" style="list-style: none;">
<summary>
<h1>- Git Sandbox -</h1>
</summary>
</ul>
</div>

<div align="center">
<a href="https://www.google.com/search?q=https://github.com/matt765/git-sandbox/blob/main/CHANGELOG.md" style="text-decoration: none;">
<img src="https://img.shields.io/badge/%20-changelog-blue?logo=readme&logoColor=white&labelColor=grey" alt="Changelog" />
</a>
<a href="https://www.google.com/search?q=https://github.com/matt765/git-sandbox/blob/main/LICENSE" style="text-decoration: none;">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/license-AGPL--3.0 / Commercial-blue" alt="License" />
</a>
<a href="https://www.google.com/search?q=https://github.com/matt765/git-sandbox/releases" style="text-decoration: none;">
<img src="https://www.google.com/search?q=https://img.shields.io/github/package-json/v/matt765/git-sandbox%3Fcolor%3Dgreen" alt="Version" />
</a>
</div>

<h4 align="center">An interactive playground for learning and experimenting with Git commands in a safe, visual environment.</h4>
<br />

<div align="center">
<!-- Insert a screenshot or a GIF of your application here! It's a key element for a visual project. -->
<img src="https://www.google.com/search?q=https://github.com/matt765/git-sandbox/assets/18222233/d12d08a0-2f69-4f7f-8d2a-e274a2f89c31" alt="Git Sandbox Screenshot" width="800" />
</div>
:gear: Tech stack

React 19, NextJS 15, TypeScript, Zustand, Three.js, Next-themes
:sparkles: Features

    Interactive Git Graph Visualization: See how your actions affect the repository history in real-time.

    Safe Sandbox Environment: Experiment with merge, rebase, cherry-pick, and other commands without any risk of data loss.

    Visual Staging Area: Move files between the working directory and the staging area with a simple interface.

    Branch Support: Create, switch, and delete branches to understand how they work.

    Graph Navigation: Pan and zoom the graph to analyze even complex histories.

    Load Public Repositories: Load the history of any public GitHub repository to analyze it in the sandbox.

:link: Links

Live Demo: https://git-sandbox.vercel.app/
:file_folder: Project Structure

├── src
│ ├── app # NextJS main app directory (App Router)
│ ├── assets # Static assets (icons)
│ ├── components # React components
│ │ ├── common # Reusable components (buttons, etc.)
│ │ ├── layout # Layout components (Navbar, ContentBox)
│ │ └── views # View components (HomepageView)
│ │ └── homepage # Homepage-specific components
│ ├── services # Services and providers (e.g., ThemeProvider)
│ ├── store # Zustand store (gitStore.ts)
│ └── styles # Global styles and themes
└── package.json # Project dependencies and scripts

:rocket: Getting started

You can get the project running locally by cloning the repository:

git clone [https://github.com/matt765/git-sandbox.git](https://github.com/matt765/git-sandbox.git)
cd git-sandbox

All commands are run from the root of the project.

Command

Action

npm install

Installs dependencies

npm run dev

Starts the dev server at localhost:3000

npm run build

Builds the app for production

npm run start

Starts the production server at localhost:3000

npm run lint

Runs ESLint to check code quality
🤝 Community and Contributions

Have an idea to improve the project or found a bug? Consider submitting a Pull Request. Before you do, please review our contribution guidelines, which include important information regarding the licensing of your contributions.

All forms of project support are valued, including code contributions, issue reporting, and sponsorship through GitHub Sponsors.
📝 License

This project is licensed under a dual-license model, offering a choice between the AGPL-3.0 and a commercial license.

You may use, distribute, and modify this software under the terms of the AGPL-3.0, which is available in the LICENSE file.

If you wish to use this software in a closed-source, commercial product without the obligations of the AGPL-3.0, a commercial license must be purchased. To inquire about purchasing a commercial license, please contact Mateusz Wyrebek at mateusz.wyrebek@gmail.com.

Made with ♥ by matt765
