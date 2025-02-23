import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddPageFab } from '../atoms/AddPageFab'
import { type SortOrderType, SortOrderTypes, useSortedPages } from '../hooks/hooks'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

/**
 * Page list component
 * @returns JSX Element
 */
export const Pages: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const [sortOrder, setSortOrder] = useState<SortOrderType>(SortOrderTypes.CreateTimeAsc)
  const pages = useSortedPages(sortOrder)

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value as SortOrderType)
  }, [])

  return (
    <Section>
      <h2 lang={i18n.language}>{t('Pages')}</h2>
      <FormControl fullWidth>
        <InputLabel id="sort-order-label">{t('Sort order')}</InputLabel>
        <Select
          labelId="sort-order-label"
          label={t('Sort order')}
          value={sortOrder}
          onChange={handleOnChange}
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
      </FormControl>
      <PageInfoList pages={pages} />
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
