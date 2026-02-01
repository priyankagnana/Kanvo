import { Box, Skeleton, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import TaskCardSkeleton from './TaskCardSkeleton'

const KanbanSkeleton = ({ columns = 4, cardsPerColumn = 3 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="text" width={80} height={20} />
    </Box>

    <Divider sx={{ mb: 2 }} />

    {/* Columns */}
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 2 }}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <motion.div
          key={colIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: colIndex * 0.1 }}
        >
          <Box
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
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="circular" width={22} height={22} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
              </Box>
            </Box>

            {/* Task Cards */}
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <TaskCardSkeleton key={cardIndex} index={cardIndex} />
            ))}
          </Box>
        </motion.div>
      ))}
    </Box>
  </motion.div>
)

export default KanbanSkeleton
