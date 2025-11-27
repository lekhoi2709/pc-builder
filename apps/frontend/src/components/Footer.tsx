import { Link } from 'react-router';
import { Mail, Github, Heart } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, type Variants } from 'framer-motion';
import { useExclusivePanel } from '../stores/exclusivePanelStore';

export default function Footer({
  className,
  isAtComponentPage,
}: {
  className?: string;
  isAtComponentPage: boolean;
}) {
  const currentYear = new Date().getFullYear();
  const { isSideBarOpen } = useExclusivePanel();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Components', path: '/components' },
        { name: 'Categories', path: '/categories' },
        { name: 'Brands', path: '/brands' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Community', path: '/community' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/lekhoi2709/pc-builder',
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: 'Email',
      href: 'mailto:support@pcbuilder.com',
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const footerVariants: Variants = {
    withSidebar: {
      width: 'var(--sidebar-width)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    noSidebar: {
      width: 'var(--sidebar-width)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.footer
      className={twMerge(
        'bg-secondary-500/20 dark:bg-secondary-600/20 border-secondary-300 dark:border-secondary-500 rounded-t-2xl shadow-md backdrop-blur-sm',
        isSideBarOpen && isAtComponentPage
          ? '!mx-auto [--sidebar-width:95%] xl:!mx-[22.2%_0%] xl:[--sidebar-width:77%]'
          : '!mx-auto [--sidebar-width:95%] xl:[--sidebar-width:98%]',
        className
      )}
      variants={footerVariants}
      animate={isSideBarOpen && isAtComponentPage ? 'withSidebar' : 'noSidebar'}
      initial="noSidebar"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12 xl:grid-cols-5">
          <div className="col-span-2 md:col-span-4 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo/pc-builder-logo-transparent.png"
                alt="PC Builder"
                className="prevent-select h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">PC Builder</span>
            </Link>
            <p className="text-primary-600 dark:text-primary-100 mt-4 text-sm">
              Your ultimate destination for browsing and selecting the perfect
              PC components.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-accent-400 dark:text-primary-100 dark:hover:text-accent-300 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map(section => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-primary-900 dark:text-primary-50 mb-4 text-sm font-semibold uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-primary-600 hover:text-accent-400 dark:text-primary-100 dark:hover:text-accent-300 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-secondary-300 dark:border-secondary-500 mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-primary-900 dark:text-primary-50 text-lg font-semibold">
                Stay Updated
              </h3>
              <p className="text-primary-600 dark:text-primary-100 mt-1 text-sm">
                Subscribe to our newsletter for the latest PC components and
                deals.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1"
              />
              <button
                type="submit"
                className="bg-accent-300 hover:bg-accent-400 dark:bg-accent-400 dark:hover:bg-accent-300 rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-secondary-300 dark:border-secondary-500 mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row">
          <p className="text-primary-600 dark:text-primary-100 text-center md:text-left">
            © {currentYear} PC Builder. All rights reserved.
          </p>
          <p className="text-primary-600 dark:text-primary-100 flex items-center gap-1 text-center">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by{' '}
            <a
              href="https://github.com/lekhoi2709"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-400 dark:hover:text-accent-300 font-semibold transition-colors duration-200"
            >
              Le Dinh Khoi
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
