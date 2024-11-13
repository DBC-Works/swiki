import EditIcon from '@mui/icons-material/Edit'
import { Fab } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Link, type ToPath } from '../adapters/Link'

type Props = React.ComponentProps<typeof Fab> & {
  pageTitle: string
  returnPath?: ToPath
}

/**
 * Edit page Floating Action Button component
 * @param props Props
 * @param props.pageTitle Page title to edit
 * @param props.returnPath Path to return
 * @returns JSX Element
 */
export const EditFab: React.FC<Props> = ({ pageTitle, returnPath }): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Link to={`/pages/${pageTitle}/edit`} returnPath={returnPath}>
      <Fab color="primary" aria-label={t('Edit')}>
        <EditIcon />
      </Fab>
    </Link>
  )
}
