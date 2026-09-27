<?xml version="1.0" encoding="utf-8"?>
<!--
  Human-readable preview of the RSS feed, set in the site's Folio paper style.
  Based on the structure of pretty-feed by aboutfeeds.com (https://github.com/genmon/aboutfeeds).
-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> · Web feed</title>
        <style type="text/css">
          /* Font copies written by scripts/build-fonts.py; this page sits outside Astro's asset pipeline. */
          @font-face { font-family: 'Source Serif Display'; src: url('/rss/fonts/source-serif-display-normal.woff2') format('woff2'); font-weight: 200 600; font-display: swap; }
          @font-face { font-family: 'Source Serif Text'; src: url('/rss/fonts/source-serif-text-normal.woff2') format('woff2'); font-weight: 400 600; font-display: swap; }
          @font-face { font-family: 'Source Serif Text'; src: url('/rss/fonts/source-serif-text-italic.woff2') format('woff2'); font-weight: 400 600; font-style: italic; font-display: swap; }
          @font-face { font-family: 'Inter Folio'; src: url('/rss/fonts/inter-normal.woff2') format('woff2'); font-weight: 400 600; font-display: swap; }
          :root {
            color-scheme: light dark;
            --bg: oklch(97.7% 0.009 82);
            --fg: oklch(23% 0.012 65);
            --body: oklch(34% 0.012 65);
            --muted: oklch(47% 0.014 65);
            --line: oklch(82% 0.016 82);
            --accent: oklch(46% 0.095 57);
            --display: 'Source Serif Display', Georgia, serif;
            --serif: 'Source Serif Text', Georgia, serif;
            --sans: 'Inter Folio', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: oklch(21% 0.012 65);
              --fg: oklch(94% 0.012 82);
              --body: oklch(84% 0.014 82);
              --muted: oklch(72% 0.016 82);
              --line: oklch(38% 0.017 65);
              --accent: oklch(76% 0.085 65);
            }
          }
          * { box-sizing: border-box; }
          body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.6 var(--sans); font-synthesis: none; }
          main { max-width: 860px; margin: 0 auto; padding: 40px clamp(20px, 5vw, 48px) 72px; }
          a { color: inherit; text-decoration: none; }
          .wordmark { font: 600 30px/1.1 var(--serif); letter-spacing: -0.02em; }
          .wordmark span { color: var(--accent); }
          .rule { margin: 18px 0 0; border-top: 2px solid var(--fg); }
          .rule + .rule { margin-top: 3px; border-top-width: 1px; }
          .note { margin: 28px 0 0; padding: 14px 16px; border-left: 1px solid var(--accent); color: var(--body); }
          .note strong { color: var(--fg); font-weight: 600; }
          .note a { text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 0.2em; }
          .note a:hover { text-decoration-color: var(--accent); }
          .sc { font: 500 12px var(--sans); letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
          h1 { margin: 44px 0 0; font: 420 clamp(40px, 7vw, 72px)/0.98 var(--display); letter-spacing: -0.03em; }
          .deck { margin: 16px 0 0; max-width: 40ch; font: italic 22px/1.4 var(--serif); color: var(--body); }
          .visit { display: inline-block; margin-top: 18px; font-weight: 600; }
          .visit:hover { color: var(--accent); }
          h2 { margin: 56px 0 12px; font: 400 36px/1.1 var(--display); }
          ul { margin: 0; padding: 0; list-style: none; border-bottom: 1px solid var(--line); }
          li a { display: block; padding: 18px 0; border-top: 1px solid var(--line); }
          li a:hover .title { font-style: italic; }
          .title { display: block; font: 400 24px/1.22 var(--serif); letter-spacing: -0.01em; }
          .desc { display: block; margin-top: 6px; color: var(--body); }
          .date { display: block; margin-top: 6px; font-size: 13px; color: var(--muted); }
        </style>
      </head>
      <body>
        <main>
          <a class="wordmark" href="/">Sudhir<span>.</span></a>
          <div class="rule"></div>
          <div class="rule"></div>
          <p class="note">
            <strong>This is a web feed,</strong> also known as an RSS feed. Subscribe by copying the URL from the address bar into your newsreader. <a href="https://aboutfeeds.com">About Feeds</a> explains how newsreaders work.
          </p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="deck"><xsl:value-of select="/rss/channel/description"/></p>
          <a class="visit">
            <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
            Visit the site →
          </a>
          <h2>Recent writing</h2>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <span class="sc"><xsl:value-of select="category"/></span>
                  <span class="title"><xsl:value-of select="title"/></span>
                  <span class="desc"><xsl:value-of select="description"/></span>
                  <span class="date"><xsl:call-template name="long-date"><xsl:with-param name="rfc" select="pubDate"/></xsl:call-template></span>
                </a>
              </li>
            </xsl:for-each>
          </ul>
        </main>
      </body>
    </html>
  </xsl:template>
  <!-- "Fri, 10 Apr 2026 00:00:00 GMT" to "10 April 2026", the site's long date format. -->
  <xsl:template name="long-date">
    <xsl:param name="rfc"/>
    <xsl:variable name="m" select="substring($rfc, 9, 3)"/>
    <xsl:value-of select="number(substring($rfc, 6, 2))"/>
    <xsl:text> </xsl:text>
    <xsl:choose>
      <xsl:when test="$m = 'Jan'">January</xsl:when>
      <xsl:when test="$m = 'Feb'">February</xsl:when>
      <xsl:when test="$m = 'Mar'">March</xsl:when>
      <xsl:when test="$m = 'Apr'">April</xsl:when>
      <xsl:when test="$m = 'May'">May</xsl:when>
      <xsl:when test="$m = 'Jun'">June</xsl:when>
      <xsl:when test="$m = 'Jul'">July</xsl:when>
      <xsl:when test="$m = 'Aug'">August</xsl:when>
      <xsl:when test="$m = 'Sep'">September</xsl:when>
      <xsl:when test="$m = 'Oct'">October</xsl:when>
      <xsl:when test="$m = 'Nov'">November</xsl:when>
      <xsl:when test="$m = 'Dec'">December</xsl:when>
    </xsl:choose>
    <xsl:text> </xsl:text>
    <xsl:value-of select="substring($rfc, 13, 4)"/>
  </xsl:template>
</xsl:stylesheet>
