import { useState, useEffect, useMemo } from "react";

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

export const useChangelog = (isOpen: boolean) => {
  const [rawContent, setRawContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchChangelog = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/matt765/git-sandbox/main/CHANGELOG.md"
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch changelog: ${response.statusText}`
            );
          }
          let text = await response.text();
          text = text.replace(/^#\s*Changelog\s*/i, "");
          setRawContent(text);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchChangelog();
    }
  }, [isOpen]);

  const formattedContent = useMemo(
    () => formatMarkdownToHtml(rawContent),
    [rawContent]
  );

  return {
    formattedContent,
    isLoading,
    error,
  };
};
