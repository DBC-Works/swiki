import AddIcon from '@mui/icons-material/Add'
import { Fab } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { inProcessingAtom } from '../../states/edit/atoms'
import { Link } from '../adapters/Link'

/**
 * Add page Floating Action Button component
 * @returns JSX Element
 */
export const AddPageFab: React.FC = (): JSX.Element => {
  const inProcessing = useAtomValue(inProcessingAtom)
  const { t } = useTranslation()

  return (
    <Link to="/NewPage" disabled={inProcessing}>
      <Fab color="primary" aria-label={t('Add new page')} disabled={inProcessing}>
        <AddIcon />
      </Fab>
    </Link>
  )
}
