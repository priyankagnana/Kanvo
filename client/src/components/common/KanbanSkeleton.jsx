import { Box, Skeleton, Divider } from '@mui/material'
import TaskCardSkeleton from './TaskCardSkeleton'

const KanbanSkeleton = ({ columns = 4, cardsPerColumn = 3 }) => (
  <Box>
    {/* Board header skeleton */}
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Skeleton animation="wave" variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton animation="wave" variant="text" width={200} height={32} />
          <Skeleton animation="wave" variant="text" width={300} height={18} />
        </Box>
      </Box>
      {/* Stats skeleton */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <Skeleton animation="wave" variant="rounded" width={80} height={28} sx={{ borderRadius: 1 }} />
        <Skeleton animation="wave" variant="rounded" width={70} height={28} sx={{ borderRadius: 1 }} />
        <Skeleton animation="wave" variant="rounded" width={100} height={28} sx={{ borderRadius: 1 }} />
        <Skeleton animation="wave" variant="rounded" width={120} height={6} sx={{ borderRadius: 3, alignSelf: 'center' }} />
      </Box>
    </Box>

    {/* Filter bar skeleton */}
    <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
      <Skeleton animation="wave" variant="rounded" width={220} height={40} sx={{ borderRadius: 2 }} />
      <Skeleton animation="wave" variant="rounded" width={100} height={32} sx={{ borderRadius: 1 }} />
      <Skeleton animation="wave" variant="rounded" width={80} height={32} sx={{ borderRadius: 1 }} />
      <Skeleton animation="wave" variant="rounded" width={90} height={32} sx={{ borderRadius: 1 }} />
      <Skeleton animation="wave" variant="rounded" width={90} height={32} sx={{ borderRadius: 1 }} />
    </Box>

    {/* Section header skeleton */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Skeleton animation="wave" variant="rounded" width={120} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton animation="wave" variant="text" width={80} height={20} />
    </Box>

    <Divider sx={{ mb: 2 }} />

    {/* Columns */}
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 2 }}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <Box
          key={colIndex}
          sx={{
            width: 300,
            minWidth: 300,
            bgcolor: 'background.default',
            borderRadius: 2,
            p: 1.5
          }}
        >
          {/* Column Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'action.disabled'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton animation="wave" variant="text" width={100} height={24} />
              <Skeleton animation="wave" variant="circular" width={22} height={22} />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Skeleton animation="wave" variant="circular" width={28} height={28} />
              <Skeleton animation="wave" variant="circular" width={28} height={28} />
            </Box>
          </Box>

          {/* Task Cards */}
          {Array.from({ length: Math.max(1, cardsPerColumn - colIndex) }).map((_, cardIndex) => (
            <TaskCardSkeleton key={cardIndex} index={cardIndex} />
          ))}
        </Box>
      ))}
    </Box>
  </Box>
)

export default KanbanSkeleton
