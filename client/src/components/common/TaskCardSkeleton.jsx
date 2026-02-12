import { Card, Skeleton, Box } from '@mui/material'

const TaskCardSkeleton = ({ index = 0 }) => (
  <Card
    sx={{
      padding: '12px',
      marginBottom: '8px',
      borderLeft: '3px solid',
      borderColor: 'action.disabled'
    }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Skeleton animation="wave" variant="text" width={60} height={16} />
      <Skeleton animation="wave" variant="circular" width={20} height={20} />
    </Box>

    {/* Title */}
    <Skeleton animation="wave" variant="text" width="85%" height={20} sx={{ mb: 0.5 }} />
    <Skeleton animation="wave" variant="text" width="60%" height={20} sx={{ mb: 1.5 }} />

    {/* Tags */}
    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
      <Skeleton animation="wave" variant="rounded" width={50} height={20} sx={{ borderRadius: 1 }} />
      <Skeleton animation="wave" variant="rounded" width={40} height={20} sx={{ borderRadius: 1 }} />
    </Box>

    {/* Footer */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={16} height={16} />
        <Skeleton animation="wave" variant="circular" width={14} height={14} />
      </Box>
      <Skeleton animation="wave" variant="rounded" width={60} height={18} sx={{ borderRadius: 1 }} />
    </Box>
  </Card>
)

export default TaskCardSkeleton
