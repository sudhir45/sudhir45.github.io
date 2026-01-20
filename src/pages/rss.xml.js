import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { AppConfig } from '@/utils/AppConfig';

export async function GET(context) {
  return rss({
    title: AppConfig.title,
    description: AppConfig.description,
    site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./posts/*.{md,mdx}'),
    ),
    stylesheet: './rss/styles.xsl',
    customData: `<language>${AppConfig.locale}-${AppConfig.locale_region.split('-')[1]}</language>`,
  });
}