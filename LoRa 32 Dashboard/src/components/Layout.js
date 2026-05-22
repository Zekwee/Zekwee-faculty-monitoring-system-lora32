
import Navbar from "./Navbar.js";
import Navigation from "./Navigation.js";

export default function Layout(content) {
  return `
    ${Navigation()}
    <main>${content}</main>
  `;
}
