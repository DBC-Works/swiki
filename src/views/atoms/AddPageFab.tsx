import AddIcon from '@mui/icons-material/Add'
import { Fab } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Link } from '../adapters/Link'

/**
 * Add page Floating Action Button component
 * @returns JSX Element
 */
export const AddPageFab: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Link to="/NewPage">
      <Fab color="primary" aria-label={t('Add new page')}>
        <AddIcon />
      </Fab>
    </Link>
  )
}
