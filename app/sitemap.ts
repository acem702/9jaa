import { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Question {
  id: number;
  title: string;
  updated_at?: string;
}

async function getMarkets(): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch markets for sitemap');
      return [];
    }
    
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error fetching markets for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://9jamarkets.com';
  const currentDate = new Date();

  // Fetch all markets dynamically
  const markets = await getMarkets();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/activity`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic market pages (highest priority for SEO)
  const marketPages: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${baseUrl}/market/${market.id}`,
    lastModified: market.updated_at ? new Date(market.updated_at) : currentDate,
    changeFrequency: 'hourly' as const,
    priority: 0.9, // High priority - main content pages
  }));

  return [...staticPages, ...marketPages];
}
