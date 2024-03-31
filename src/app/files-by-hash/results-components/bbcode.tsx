import * as bbcode from 'bbcode-compiler';
import * as entities from 'entities';
import encodeURI from 'full-uri-escaper';

// Nexus uses an inline icon so I might as well 🤷‍♂️
// TODO: Implement icon
export const quoteIcon = '<svg class="icon-quote"><path class="path1" d="M0 20.674c0 7.225 4.668 11.337 9.892 11.337 4.824-0.062 8.719-3.956 8.781-8.775 0-4.785-3.334-8.009-7.558-8.009-0.078-0.004-0.17-0.006-0.262-0.006-0.703 0-1.377 0.124-2.001 0.352 1.041-4.014 5.153-8.683 8.71-10.572l-6.113-5.002c-6.891 4.891-11.448 12.338-11.448 20.674zM22.675 20.674c0 7.225 4.668 11.337 9.892 11.337 4.8-0.056 8.67-3.961 8.67-8.769 0-0.004 0-0.008 0-0.012 0-4.779-3.223-8.002-7.447-8.002-0.095-0.006-0.206-0.009-0.318-0.009-0.684 0-1.339 0.126-1.943 0.355 0.927-4.014 5.15-8.682 8.707-10.572l-6.124-5.002c-6.891 4.891-11.437 12.338-11.437 20.674z"></path></svg>';

export const nexusTags = [
    ...bbcode.htmlTransforms,

    { // TODO: Style [code]!
        name: 'code',
        start: ()=> '<pre><code>',
        end: ()=> '</code></pre>',
    },
    {
        name: 'quote',
        start: (tagNode) => {
            const authorName = tagNode.attributes.find((attr) => attr.key === 'name')?.val;
            const timestamp = tagNode.attributes.find((attr) => attr.key === 'timestamp')?.val;
            const postID = tagNode.attributes.find((attr) => attr.key === 'post')?.val;

            const authorText = authorName ? `<div class="quote-author">${entities.encodeHTML5(authorName)}</div> said` : '';
            const timestampText = timestamp ? `at <div class="quote-timestamp">${new Date(parseInt(timestamp)).toLocaleString()}</div>` : '';
            const buttonLink = postID ? `<a href="https://forums.nexusmods.com/index.php?app=forums&module=forums&section=findpost&pid=${postID}" class="quote-button">View Post</a>` : '';

            return `<div class="quote"><div class="quote-header">${authorText}${timestampText}${buttonLink}</div><div class="quote-content">`;
        },
        end: () => '</div></div>',
    },
    {
        name: 'youtube',
        skipChildren: true, // Do not actually render the link text
        start: (tagNode) => {
            const src = bbcode.getTagImmediateText(tagNode);
            if (!src) return false;

            const matches = /(?:\/(?:watch\?v=|v\/|shorts\/)|-)([^\n&#]+)/.exec(src);
            if (!matches) return false;

            const videoId = matches[1];
            const { width, height } = bbcode.getWidthHeightAttr(tagNode);

            return `<iframe
                width="${entities.encodeHTML5((width ?? '560'))}"
                height="${entities.encodeHTML5((height ?? '315'))}"
                src="https://www.youtube-nocookie.com/embed/${encodeURI(videoId || '')}"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>`;
        },
    },
    { name: 'center', start: () => '<div style="text-align: center;">', end: () => '</div>', },
    { name: 'left', start: () => '<div style="text-align: left;">', end: () => '</div>', },
    { name: 'right', start: () => '<div style="text-align: right;">', end: () => '</div>', },
    {
        name: 'size',
        start: (tagNode) => {
            const size = bbcode.getTagImmediateAttrVal(tagNode);
            if (!size) return false;

            return `<font size="${entities.encodeHTML5(size)}">`;
        },
        end: () => '</font>',
        isLinebreakTerminated: false,
    },
    {
        name: 'font',
        start: (tagNode) => {
            let fontFamily = '';
            for (const attr of tagNode.attributes) {
                if (attr.key === 'default') fontFamily += `${attr.val} `;
                else break;
            }

            return `<span style="font-family: ${entities.encodeHTML5(fontFamily)}">`;
        },
        end: () => '</span>',
    },
    {
        name: 'url',
        start: (tagNode) => {
            let href = '';
            for (const attr of tagNode.attributes) {
                if (attr.key === 'default') href += `${attr.val}`;
                else break;
            }

            return `<a href="${entities.encodeHTML5(href)}">`;
        },
        end: () => '</a>',
    },
    {
        name: 'ol',
        start: () => '<ol>',
        end: () => '</ol>',
    },
    {
        name: 'ul',
        start: () => '<ul>',
        end: () => '</ul>',
    },
    {
        name: 'line',
        start: () => '<hr>',
        isStandalone: true,
    },
    {
        name: 'hr',
        start: () => false,
        isStandalone: true,
    },
    {
        name: 'table',
        start: () => false,
    },
    {
        name: 'tr',
        start: () => false,
    },
    {
        name: 'td',
        start: () => false,
    },
    {
        name: 'style',
        start: () => false,
    },
    {
        name: '*',
        isLinebreakTerminated: false,
        start: () => '<li>',
        end: () => '</li>',
    },
    { // TODO: Style [spoiler]!
        name: 'spoiler',
        start: () => '<details><summary>Spoiler: &nbsp;<span class="show-button">Show</span></summary><div class="spoiler-contents">',
        end: () => '</div></details>',
    },
    {
        name: 'soundcloud',
        start: tagNode => `<iframe
            width="60%"
            height="166"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=${encodeURI(bbcode.getTagImmediateText(tagNode)?.toString() || '')}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
        </iframe>`,
        skipChildren: true,
    },
] as const satisfies ReadonlyArray<bbcode.Transform>;

export function compileBBCode(str: string) {
    str = str.replace(/<br \/>((?:\[[^\]]*?\])*?\[\*\])/mg, '$1');

    let lastStr;
    do {
        lastStr = str;
        str = str.replace(/\[(?!spoiler)([\w\*]+)\b[^\]]*\]((?:[﻿\n)]|<br \/>)*)\[\/\1\]/giu, '$2');
    } while (lastStr !== str);

    do {
        lastStr = str;
        str = entities.decodeHTML5Strict(bbcode.generateHtml(str, nexusTags));
        console.log('compiled BBCode:', {str, lastStr});
    } while (lastStr !== str);

    return str.replace(/\n|\r\n?/, '');
}

export function BBCode({bbcode}: {bbcode: string}) {
    return <div><div><div><div>
        <div dangerouslySetInnerHTML={{__html: compileBBCode(bbcode)}} />
    </div></div></div></div>;
}
