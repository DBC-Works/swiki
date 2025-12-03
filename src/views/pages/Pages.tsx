import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type TextFieldProps,
  css,
} from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddPageFab } from '../atoms/AddPageFab'
import { type SortOrderType, SortOrderTypes, useFilteredPages } from '../hooks/hooks'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

const KeywordTextField: React.FC<TextFieldProps> = ({ onChange }) => {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState<string>('')

  const handleOnChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
      if (onChange) {
        onChange(e)
      }
    },
    [onChange],
  )

  return (
    <TextField
      fullWidth
      type="search"
      label={t('Keyword')}
      value={keyword}
      onChange={handleOnChangeKeyword}
    />
  )
}

const CSS_SEARCH = css({
  marginTop: 'var(--gap-unit)',
})

const CSS_NO_MATCH = css({
  margin: '1rem',
})

let timerId: ReturnType<typeof setTimeout> | null = null

/**
 * Page list component
 * @returns JSX Element
 */
export const Pages: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const [sortOrder, setSortOrder] = useState<SortOrderType>(SortOrderTypes.CreateTimeAsc)
  const [filteringKeyword, setFilteringKeyword] = useState<string>('')
  const pages = useFilteredPages(filteringKeyword, sortOrder)

  const handleOnChangeSortOrder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value as SortOrderType)
  }, [])
  const handleOnChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value !== filteringKeyword) {
        if (timerId !== null) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          setFilteringKeyword(e.target.value)
          timerId = null
        }, 250)
      }
    },
    [filteringKeyword],
  )

  return (
    <Section>
      <h2 lang={i18n.language}>{t('Pages')}</h2>
      <FormControl fullWidth>
        <InputLabel id="sort-order-label">{t('Sort order')}</InputLabel>
        <Select
          labelId="sort-order-label"
          label={t('Sort order')}
          value={sortOrder}
          onChange={handleOnChangeSortOrder}
        >
          {Object.keys(SortOrderTypes).map((sortOrder) => {
            // @ts-ignore
            const sortOrderValue = SortOrderTypes[sortOrder]
            return (
              <MenuItem key={sortOrder} value={sortOrderValue}>
                {t(sortOrderValue)}
              </MenuItem>
            )
          })}
        </Select>
        <search css={CSS_SEARCH}>
          <KeywordTextField onChange={handleOnChangeKeyword} />
        </search>
      </FormControl>
      {0 < pages.length ? (
        <PageInfoList pages={pages} />
      ) : (
        <div css={CSS_NO_MATCH}>{t('No match')}</div>
      )}
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
