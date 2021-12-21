import { Alert, AlertColor, Snackbar } from '@mui/material'
import { SyntheticEvent } from 'react'
interface NotificationProps {
  open: boolean | undefined
  onClose: ((event: SyntheticEvent<any, Event>) => void) | undefined
  severity?: AlertColor | undefined
  autoHideDuration?: number | null | undefined
  children?: any
}

const Notification: React.FC<NotificationProps> = (props) => {
  const { open, onClose, autoHideDuration, severity, children } = props
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {children}
      </Alert>
    </Snackbar>
  )
}

export default Notification
