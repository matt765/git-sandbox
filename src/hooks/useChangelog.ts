import { useMemo } from "react";
// Import the CHANGELOG.md file directly
import changelogMd from "../../CHANGELOG.md";

const formatMarkdownToHtml = (text: string): string => {
  if (!text) return "";

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
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
      html += `<li>${line.substring(2)}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    }
  }

  if (inList) {
    html += "</ul>";
  }
  return html;
};

export const useChangelog = () => {
  // Remove the first H1 title from the markdown content
  const processedContent = useMemo(() => {
    let text = changelogMd;
    text = text.replace(/^#\s*Changelog\s*/i, "");
    return text;
  }, []);

  const formattedContent = useMemo(
    () => formatMarkdownToHtml(processedContent),
    [processedContent]
  );

  return {
    formattedContent,
    isLoading: false,
    error: null,
  };
};
