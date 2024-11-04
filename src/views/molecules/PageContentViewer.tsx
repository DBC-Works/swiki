import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = Omit<React.ComponentProps<'article'>, 'children'> & {
  children: string
}

/**
 * PageContentViewer component
 * @param props Props
 * @param props.children Markdown text to view
 * @returns JSX Element
 */
export const PageContentViewer: React.FC<Props> = ({ children }): JSX.Element => {
  const { i18n } = useTranslation()

  return (
    <article lang={i18n.language}>
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </article>
  )
}
