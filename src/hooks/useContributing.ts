import { useMemo } from "react";
// Import the CONTRIBUTING.md file directly
import contributingMd from "../../CONTRIBUTING.md";

const formatMarkdownToHtml = (text: string): string => {
  if (!text) return "";

  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let isFirstH1 = true; // Flag to skip the first H1

  for (const line of lines) {
    if (line.startsWith("# ")) {
      if (isFirstH1) {
        isFirstH1 = false;
        continue; // Skip the first H1 title
      }
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h1>${line.substring(2)}</h1>`;
    } else if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${line.substring(3)}</h2>`;
    } else if (line.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${line.substring(4)}</h3>`;
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      let listItem = line.substring(2);
      // Handle bold text in list items
      const boldRegex = /\*\*([^*]+)\*\*/g;
      listItem = listItem.replace(boldRegex, '<strong>$1</strong>');
      // Handle links in list items
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      listItem = listItem.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      html += `<li>${listItem}</li>`;
    } else if (line.trim() !== "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      // Handle links in markdown format [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let formattedLine = line.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Handle bold text in markdown format **text**
      const boldRegex = /\*\*([^*]+)\*\*/g;
      formattedLine = formattedLine.replace(boldRegex, '<strong>$1</strong>');
      
      html += `<p>${formattedLine}</p>`;
    }
  }

  if (inList) {
    html += "</ul>";
  }
  return html;
};

export const useContributing = () => {
  const formattedContent = useMemo(
    () => formatMarkdownToHtml(contributingMd),
    []
  );

  return {
    formattedContent,
    isLoading: false,
    error: null,
  };
};
