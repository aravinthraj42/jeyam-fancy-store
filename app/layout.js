import './globals.css';
import { Providers } from '../src/components/Providers';

export const metadata = {
  title: 'Jeyam Fancy Store',
  description: 'Premium fancy store with elegant products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

