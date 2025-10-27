![NPM Version](https://img.shields.io/npm/v/iconify-cli)
![NPM Version](https://img.shields.io/npm/l/iconify-cli)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bytelab-studio/iconify-cli/cd.yml?label=CD)

# Iconify CLI

**Iconify CLI** is an **unofficial** CLI tool for downloading icons from the Iconify ecosystem.

## ✨ Features

- **⚙️ Simple Configuration** —
  Define per-project defaults using a lightweight .iconify file. Override settings anytime with CLI flags.
- **🔍 Powerful Search** —
  Quickly search the entire Iconify catalog from your terminal or integrate the search API into your own tools.
- **🧩 Template-Based Output** —
  Generate icons in multiple formats such as raw SVG, Vue, React, or Svelte components — all with proper
  attribution headers.
- **🧠 Programmatic API** —
  Use the same library directly in Node.js scripts or build pipelines for automated icon management.
- **🖥️ Visual Mode (Coming Soon)** —
  Launch a local browser UI for exploring and batch-downloading icons, seamlessly powered by the core CLI.
- **🪶 Lightweight & Extensible**
  Minimal dependencies, clean code, and a modular structure — ready to extend with custom templates or
  integrations.

## 📦 Installation

```shell
npm install -g iconify-cli
```

## 🚀 Usage

Without project config:

```shell
iconify download mdi:home mdi:person -o ./icons -t vue -p flat -n pascal
```

With project config:

```shell
iconify config init
```

```shell
iconify download mdi:home mdi:person
```

## 📚 Documentation

See [Documentation](https://iconify-cli.bytelab.studio/) for more information

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.