import rss from '@astrojs/rss';
import { AppConfig } from '@/utils/AppConfig';
import { getAllPosts } from '@/utils/posts';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: AppConfig.title,
    description: AppConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: post.url,
      categories: post.data.tags,
    })),
    stylesheet: './rss/styles.xsl',
    customData: `<language>${AppConfig.locale}-${AppConfig.locale_region.split('-')[1]}</language>`,
  });
}
