import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
export const PageContentViewer: React.FC<Props> = ({ lang, pageTitle, children }): JSX.Element => (
  <article lang={lang}>
    {pageTitle && <h2>{pageTitle}</h2>}
    <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
  </article>
)
