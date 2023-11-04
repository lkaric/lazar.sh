import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="row-start-3 col-start-2 col-end-12">
      <Link href="/contact">contact</Link>
    </footer>
  );
};

export { Footer };
