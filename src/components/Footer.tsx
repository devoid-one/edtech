import Link from "next/link";

/**
 * Footer with candidate info per House of Edtech submission guidelines.
 * Replace placeholders with your name, GitHub, and LinkedIn.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-[var(--muted)]">
          <p>
            Built for House of Edtech – Fullstack Developer Assignment (Dec 2025)
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Your Name</strong>
            {" · "}
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              GitHub
            </a>
            {" · "}
            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
