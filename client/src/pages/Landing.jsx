import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Chip, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import assets from '../assests/index'
import SpeedIcon from '@mui/icons-material/Speed'
import GroupsIcon from '@mui/icons-material/Groups'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import SecurityIcon from '@mui/icons-material/Security'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

const features = [
  {
    icon: ViewKanbanIcon,
    title: 'Kanban Boards',
    description: 'Visualize your workflow with intuitive drag-and-drop boards. Move tasks seamlessly between stages.'
  },
  {
    icon: SpeedIcon,
    title: 'Lightning Fast',
    description: 'Built for speed. Real-time updates, instant syncing, and a responsive interface that keeps up with you.'
  },
  {
    icon: GroupsIcon,
    title: 'Team Collaboration',
    description: 'Work together effortlessly. Share boards, assign tasks, and keep everyone aligned on goals.'
  },
  {
    icon: SecurityIcon,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. Enterprise-grade security for peace of mind.'
  },
  {
    icon: AutoAwesomeIcon,
    title: 'Beautiful Design',
    description: 'A clean, modern interface that makes project management enjoyable, not just functional.'
  },
  {
    icon: CheckCircleIcon,
    title: 'Subtasks & Progress',
    description: 'Break down complex tasks into subtasks. Track progress with visual indicators and completion rates.'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at TechCorp',
    avatar: 'S',
    quote: 'Kanvo transformed how our team manages sprints. The simplicity is its superpower.'
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    avatar: 'M',
    quote: 'Finally, a project management tool that doesn\'t get in the way. Clean, fast, and just works.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Engineering Lead',
    avatar: 'E',
    quote: 'We switched from Jira and never looked back. Our team productivity increased by 40%.'
  }
]

const Landing = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navigation */}
      <Box
        component={motion.nav}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(26, 26, 46, 0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="img"
                src={assets.images.logo}
                alt="Kanvo Logo"
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain'
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Kanvo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                sx={{ color: 'white', fontWeight: 500 }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0747A6 0%, #403294 100%)'
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: 10
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,204,0.15) 0%, transparent 70%)',
            top: '-200px',
            right: '-200px'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(101,84,192,0.15) 0%, transparent 70%)',
            bottom: '-100px',
            left: '-100px'
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Chip
                    label="Now in Beta"
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(0,82,204,0.2)',
                      color: '#4C9AFF',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 3,
                      color: 'white'
                    }}
                  >
                    Project management,{' '}
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(135deg, #4C9AFF 0%, #8777D9 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      simplified.
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: 500
                    }}
                  >
                    Stop drowning in complexity. Kanvo gives you powerful project management
                    with a clean interface that actually helps you get things done.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0747A6 0%, #403294 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 40px rgba(0,82,204,0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Start for Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 500,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.05)'
                        }
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 5 }}>
                    <Box sx={{ display: 'flex' }}>
                      {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((color, i) => (
                        <Avatar
                          key={i}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: color,
                            border: '2px solid #1a1a2e',
                            ml: i > 0 ? -1.5 : 0,
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </Avatar>
                      ))}
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'white' }}>2,000+</strong> teams already onboard
                    </Typography>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -20,
                      background: 'linear-gradient(135deg, rgba(0,82,204,0.2), rgba(101,84,192,0.2))',
                      borderRadius: 4,
                      filter: 'blur(40px)'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=80"
                    alt="Kanban Board Preview"
                    sx={{
                      width: '100%',
                      borderRadius: 3,
                      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                      position: 'relative',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 15,
          background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    fontWeight: 700,
                    color: 'white',
                    mb: 2
                  }}
                >
                  Everything you need to ship faster
                </Typography>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.1rem',
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  Powerful features wrapped in a simple interface. No learning curve, just results.
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={scaleIn}>
                    <Card
                      sx={{
                        height: '100%',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: 'rgba(0,82,204,0.5)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(0,82,204,0.2) 0%, rgba(101,84,192,0.2) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3
                          }}
                        >
                          <feature.icon sx={{ fontSize: 28, color: '#4C9AFF' }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: 'white', mb: 1.5 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 15, bgcolor: '#1a1a2e' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    fontWeight: 700,
                    color: 'white',
                    mb: 2
                  }}
                >
                  Loved by teams everywhere
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        height: '100%',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        p: 1
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                            mb: 3,
                            fontStyle: 'italic'
                          }}
                        >
                          "{testimonial.quote}"
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                              fontWeight: 600
                            }}
                          >
                            {testimonial.avatar}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 600 }}>
                              {testimonial.name}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 15,
          background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            top: '-200px',
            left: '-100px'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            bottom: '-150px',
            right: '-50px'
          }}
        />

        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  color: 'white',
                  mb: 2
                }}
              >
                Ready to transform your workflow?
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1.2rem',
                  mb: 4,
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                Join thousands of teams using Kanvo to ship products faster.
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#0052CC',
                  fontWeight: 700,
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started - It's Free
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: '#0f0f1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="img"
                src={assets.images.logo}
                alt="Kanvo Logo"
                sx={{
                  width: 32,
                  height: 32,
                  objectFit: 'contain'
                }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                2025 Kanvo. Built with passion.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                <GitHubIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Landing
