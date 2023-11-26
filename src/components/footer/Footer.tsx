import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="row-start-3 col-start-2 col-end-12">
      <a
        href="https://lkaric.notion.site/Lazar-Kari-cf5e1c510df3452ebb5dc8d61d6c4d0b"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-orange-600 transition-colors p-2"
        aria-label="Resume"
      >
        resume
      </a>
    </footer>
  );
};

export { Footer };
