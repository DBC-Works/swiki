import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Link } from '../adapters/Link'
import { getPageBrowsePath } from '../utils'

type Props = Omit<React.ComponentProps<'article'>, 'children'> & {
  lang: string
  pageTitle?: string
  children: string
}

/**
 * PageContentViewer component
 * @param props Props
 * @param props.lang Language
 * @param props.pageTitle Page title
 * @param props.children Markdown text to view
 * @returns JSX Element
 */
export const PageContentViewer: React.FC<Props> = ({ lang, pageTitle, children }): JSX.Element => {
  const PREFIX_INNER_LINK = 'http://localhost:65535/'
  return (
    <article lang={lang}>
      {pageTitle && <h2>{pageTitle}</h2>}
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a(props) {
            const { href, children, node, ...rest } = props
            return href?.startsWith(PREFIX_INNER_LINK) ? (
              <Link
                to={getPageBrowsePath(decodeURIComponent(href.substring(PREFIX_INNER_LINK.length)))}
              >
                {children}
              </Link>
            ) : (
              <a target="_blank" href={href} {...rest}>
                {children}
              </a>
            )
          },
        }}
      >
        {children.replace(
          /\[\[(.+?)(?<!\]\])\]\]/g,
          (_, p1) => `[${p1}](${PREFIX_INNER_LINK}${encodeURIComponent(p1)})`,
        )}
      </Markdown>
    </article>
  )
}
