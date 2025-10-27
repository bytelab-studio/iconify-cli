import {defineConfig} from 'vitepress';
import apiSideBar from "../api/typedoc-sidebar.json";


// region Fix typedoc sidebar
function modifyItem(group: any) {
    delete group.collapsed;
    for (const item of group.items) {
        if (item.link.startsWith("/docs")) {
            item.link = item.link.substring(5);
        }
        if ("collapsed" in item) {
            delete item["collapsed"];
        }
        if ("items" in item) {
            for (const subGroup of item.items) {
                modifyItem(subGroup);
            }
        }
    }
}

for (const group of apiSideBar) {
    modifyItem(group);
}
// endregion

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Iconify CLI",
    description: "A fast, unofficial command-line tool for searching and downloading icons from the Iconify ecosystem.",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Getting started', link: '/getting-started'},
        ],
        sidebar: [
            {
                items: [
                    {text: 'Getting started', link: '/getting-started'},
                    {text: 'Programmatic usage', link: '/programmatic-usage'},
                ]
            },
            {
                text: "API",
                link: "/api/",
                items: apiSideBar
            }
        ],

        footer: {
            message: `<a href="https://bytelab.studio/imprint" target="_blank">Imprint</a> <a href="https://bytelab.studio/privacy" target="_blank">Privacy Policy</a>`,
            copyright: `Copyright (c) ${new Date().getFullYear()} Bytelab Studio`
        },

        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/bytelab-studio/iconify-cli"
            },
        ]
    },
    markdown: {
        theme: {
            light: "catppuccin-latte",
            dark: "catppuccin-macchiato"

        }
    }
})
