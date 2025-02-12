import { css } from '@emotion/react'
import { Tab, Tabs } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type Subsequence, SubsequenceTypes, generateDiffSequence } from '../../models/diffSequence'
import { type Page, type PageData, PathTypes } from '../../states/pages/types'
import { Link } from '../adapters/Link'
import { useMoveTo } from '../adapters/hooks'
import { Time } from '../atoms/Time'
import { useMaterialUiBorderColor, usePageWithSpecifiedTitle } from '../hooks/hooks'
import { Section } from '../templates/Section'
import { getPageBrowsePath } from '../utils'

type SubsequenceBlockProps = {
  subsequence: Subsequence
  fromLang: string
  toLang: string
  first: boolean
  last: boolean
}

const SubsequenceBlock: React.FC<SubsequenceBlockProps> = ({
  subsequence,
  fromLang,
  toLang,
  first,
  last,
}): JSX.Element => {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const borderColor = useMaterialUiBorderColor()

  const CSS_CODE = css({
    margin: '0',
    minHeight: '1em',
    padding: '1rem',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  })

  const subsequenceCss = css({
    borderStyle: 'solid',
    borderColor: borderColor,
    borderWidth: `1px 1px ${last ? '1px' : '0'}`,
    borderRadius: `${first ? '4px 4px' : '0 0'} ${last ? '4px 4px' : '0 0'}`,
  })
  const typeCss = css({
    color: `${palette.text.secondary}`,
    padding: '0.5rem',
    borderBottom: `1px solid ${borderColor}`,
  })

  return (
    <div css={subsequenceCss}>
      <div css={typeCss}>{t(subsequence.type)}</div>
      <pre lang={subsequence.type === SubsequenceTypes.Deleted ? fromLang : toLang} css={CSS_CODE}>
        {subsequence.sequence.join('\n')}
      </pre>
    </div>
  )
}

const ComparisonInfo: React.FC<{
  fromRev: PageData
  toRev: PageData
}> = ({ fromRev, toRev }): JSX.Element => {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const borderColor = useMaterialUiBorderColor()

  const CSS_INFO = css({
    padding: '1rem',
    lineHeight: '1.5em',
  })
  const containerCss = css({
    borderRadius: '4px',
    border: `1px solid ${borderColor}`,
  })
  const headingCss = css({
    margin: 0,
    padding: '0.5rem',
    borderBottom: `1px solid ${borderColor}`,
    fontSize: '1rem',
    color: `${palette.text.secondary}`,
  })

  return (
    <div css={containerCss}>
      <h3 css={headingCss}>{t('Target')}</h3>
      <div
        lang={toRev.language}
        css={[
          CSS_INFO,
          {
            borderBottom: `1px solid ${borderColor}`,
          },
        ]}
      >
        {t("This revision's title - ")}
        {toRev.title}
        <br />
        {t('Update time - ')}
        <Time dateTime={toRev.dateAndTime} />
      </div>
      <h3 css={headingCss}>{t('Source')}</h3>
      <div lang={fromRev.language} css={CSS_INFO}>
        {t("This revision's title - ")}
        {fromRev.title}
        <br />
        {t('Update time - ')}
        <Time dateTime={fromRev.dateAndTime} />
      </div>
    </div>
  )
}

type PageDiffProps = {
  pageTitle: string
  from: string
  to: string
}

/**
 * Page diff component
 * @param props Props
 * @param props.pageTitle Encoded page title
 * @param props.from Revision number to compare from
 * @param props.to Revision number to compare to
 * @returns JSX Element
 */
export const PageDiff: React.FC<PageDiffProps> = ({ pageTitle, from, to }): JSX.Element | null => {
  const { t } = useTranslation()
  const moveTo = useMoveTo()
  const [tabId, setTabId] = useState('difference')

  const title = decodeURIComponent(pageTitle)
  const page = usePageWithSpecifiedTitle(title)
  const hasTitle = page !== null

  const historyCount = page ? page.pageDataHistory.length : -1
  const fromRevNo = Number(from)
  const toRevNo = Number(to)
  const isValidRevision =
    Number.isSafeInteger(fromRevNo) &&
    Number.isSafeInteger(toRevNo) &&
    fromRevNo !== toRevNo &&
    1 <= fromRevNo &&
    fromRevNo <= historyCount &&
    1 <= toRevNo &&
    toRevNo <= historyCount

  const pageBrowsePath = hasTitle ? getPageBrowsePath(title) : PathTypes.Pages
  const canShow = hasTitle && isValidRevision
  useEffect(() => {
    if (canShow === false) {
      moveTo(pageBrowsePath)
    }
  }, [canShow, moveTo, pageBrowsePath])
  if (canShow === false) {
    return null
  }

  const { pageDataHistory } = page as Page
  const latestRev = pageDataHistory[historyCount - 1]
  const fromRev = pageDataHistory[historyCount - fromRevNo]
  const toRev = pageDataHistory[historyCount - toRevNo]
  const sequence = generateDiffSequence(fromRev.content.split('\n'), toRev.content.split('\n'))

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: string) => {
    setTabId(newValue)
  }, [])

  const CSS_TABS = css({ marginBottom: 'var(--gap-unit)' })
  const CSS_CONTENT = css({ margin: 'var(--gap-unit) 0' })
  return (
    <Section>
      <h2 lang={latestRev.language}>
        {t('Diff between Rev.{{from}} and Rev.{{to}} of “{{title}}”', {
          from,
          to,
          title,
        })}
      </h2>
      <Tabs value={tabId} css={CSS_TABS} onChange={handleChangeTab}>
        <Tab label={t('Difference')} value="difference" />
        <Tab label={t('Information')} value="information" />
      </Tabs>
      <div css={CSS_CONTENT}>
        {tabId === 'difference' && (
          <>
            {sequence.map((subsequence, index) => (
              <SubsequenceBlock
                key={crypto.randomUUID()}
                subsequence={subsequence}
                fromLang={fromRev.language}
                toLang={toRev.language}
                first={index === 0}
                last={index === sequence.length - 1}
              />
            ))}
            <div css={CSS_CONTENT}>
              <Link to={pageBrowsePath}>
                {t('Back to “{{title}}”', {
                  title,
                })}
              </Link>
            </div>
          </>
        )}
        {tabId === 'information' && <ComparisonInfo fromRev={fromRev} toRev={toRev} />}
      </div>
    </Section>
  )
}
