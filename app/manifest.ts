import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FOREKAST - Professional Prediction Markets',
    short_name: 'FOREKAST',
    description: 'Express your opinions on global events and market outcomes. Trade prediction markets, track your portfolio, and compete on the leaderboard with FOREKAST.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/mobile-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
