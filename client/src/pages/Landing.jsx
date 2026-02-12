import { Box, Container, Typography, Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import assets from '../assests/index'

const Landing = () => {
  return (
    <Box sx={{ bgcolor: '#111113', color: '#fafafa', minHeight: '100vh' }}>

      {/* ─── Top announcement strip ─── */}
      <Box sx={{ bgcolor: '#fafafa', py: 0.75 }}>
        <Container maxWidth="lg">
          <Typography
            component={Link}
            to="/signup"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#111113',
              textDecoration: 'none',
              letterSpacing: '-0.01em'
            }}
          >
            Kanvo is now in public beta — try it free
            <NorthEastIcon sx={{ fontSize: 13 }} />
          </Typography>
        </Container>
      </Box>

      {/* ─── Nav ─── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: 'rgba(17,17,19,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="img"
                src={assets.images.logo}
                alt="Kanvo"
                sx={{ width: 28, height: 28, objectFit: 'contain' }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#fafafa' }}>
                Kanvo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: '#71717a',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  '&:hover': { color: '#fafafa' },
                  transition: 'color 0.2s'
                }}
              >
                Log in
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                endIcon={<NorthEastIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  bgcolor: '#fafafa',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  textTransform: 'none',
                  px: 2.5,
                  py: 0.75,
                  borderRadius: '100px',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#e4e4e7', boxShadow: 'none' }
                }}
              >
                Get started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── Hero (full viewport, left-aligned) ─── */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background ambient glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-40%)',
            width: '900px',
            height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, rgba(59,130,246,0.04) 35%, transparent 65%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 55%)',
            pointerEvents: 'none'
          }}
        />
        {/* Dot grid */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 70%)'
          }}
        />

        {/* Hero content */}
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2, pt: { xs: 8, md: 0 } }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem', lg: '6.5rem' },
                    fontWeight: 600,
                    lineHeight: 1.0,
                    letterSpacing: '-0.045em',
                    color: '#fafafa',
                    mb: { xs: 3, md: 4 }
                  }}
                >
                  Ship projects,
                  <br />
                  <Box
                    component="span"
                    sx={{ color: '#52525b' }}
                  >
                    not spreadsheets.
                  </Box>
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    lineHeight: 1.7,
                    color: '#71717a',
                    maxWidth: 480,
                    mb: 4
                  }}
                >
                  The Kanban tool that gets out of your way.
                  Drag-and-drop boards, task tracking, and analytics — nothing more.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
                    sx={{
                      bgcolor: '#fafafa',
                      color: '#111113',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      px: 3.5,
                      py: 1.25,
                      borderRadius: '100px',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#e4e4e7', boxShadow: 'none' }
                    }}
                  >
                    Start for free
                  </Button>
                  <Typography sx={{ fontSize: '0.8rem', color: '#3f3f46' }}>
                    No credit card required
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Bottom bar — pinned to bottom of hero */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2 }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 3,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', color: '#52525b', maxWidth: 400, lineHeight: 1.5 }}>
                A focused project management tool for makers, founders, and small teams who value simplicity.
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600
                }}
              >
                Built for builders. Free forever.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ─── Problem ─── */}
      <Box sx={{ py: { xs: 10, md: 16 }, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  position: 'sticky',
                  top: 100
                }}
              >
                The problem
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 600,
                  lineHeight: 1.25,
                  letterSpacing: '-0.035em',
                  color: '#fafafa',
                  mb: 3
                }}
              >
                Project management tools are bloated. You don't need 200 features, 14 views, and a week-long setup.
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#52525b', maxWidth: 600 }}>
                Jira is built for enterprises with dedicated admins. Asana wants you to learn their system.
                Monday.com needs a manual. Your team just needs a board, cards, and a way to move things forward.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── How it works ─── */}
      <Box sx={{ py: { xs: 10, md: 16 }, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start" sx={{ mb: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600
                }}
              >
                How it works
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  color: '#fafafa'
                }}
              >
                Three steps. That's it.
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            {[
              {
                num: '01',
                title: 'Create a board',
                desc: 'Name your project and you\'re live in seconds. No configuration wizards, no mandatory fields.'
              },
              {
                num: '02',
                title: 'Add sections & tasks',
                desc: 'Create columns for your workflow. Add tasks with priorities, due dates, subtasks, and tags.'
              },
              {
                num: '03',
                title: 'Drag, drop, ship',
                desc: 'Move tasks between columns as work progresses. See completion stats in real time.'
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    py: { xs: 4, md: 5 },
                    pr: { md: 5 },
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    height: '100%'
                  }}
                >
                  <Typography sx={{ fontSize: '3rem', fontWeight: 700, color: '#1e1e22', letterSpacing: '-0.03em', lineHeight: 1, mb: 3 }}>
                    {item.num}
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fafafa', mb: 1.5, letterSpacing: '-0.01em' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#52525b' }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Features ─── */}
      <Box sx={{ py: { xs: 10, md: 16 }, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start" sx={{ mb: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600
                }}
              >
                Capabilities
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  color: '#fafafa',
                  mb: 2
                }}
              >
                Everything you need.
                <Box component="span" sx={{ color: '#3f3f46' }}> Nothing you don't.</Box>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            {[
              { title: 'Drag-and-drop Kanban', desc: 'Intuitive boards that work the way you think.' },
              { title: 'Task priorities', desc: 'High, medium, low. Color-coded and filterable.' },
              { title: 'Due dates & tracking', desc: 'See overdue tasks at a glance. Never miss a deadline.' },
              { title: 'Subtasks', desc: 'Break work into steps. Track completion per task.' },
              { title: 'Search & filters', desc: 'Find any task instantly by status, priority, or text.' },
              { title: 'Rich text editor', desc: 'Full editor for task details. Format what matters.' },
              { title: 'Real-time analytics', desc: 'Completion rates, status breakdown, activity tracking.' },
              { title: 'Dark & light mode', desc: 'Comfortable in any lighting. Switch in one click.' }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderRight: { md: (index + 1) % 4 !== 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' },
                    height: '100%'
                  }}
                >
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fafafa', mb: 0.75, letterSpacing: '-0.01em' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.825rem', color: '#52525b', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Testimonials ─── */}
      <Box sx={{ py: { xs: 10, md: 16 }, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start" sx={{ mb: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600
                }}
              >
                Testimonials
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  color: '#fafafa'
                }}
              >
                Teams that switched aren't going back.
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            {[
              {
                quote: 'We replaced a $4,000/year Jira license with Kanvo. Our team actually uses it now — that\'s the difference.',
                name: 'Sarah Chen',
                role: 'Product Lead'
              },
              {
                quote: 'I set up our entire project workflow in 10 minutes. Tried doing that with Monday.com once. Gave up after an hour.',
                name: 'Marcus Johnson',
                role: 'Founder'
              },
              {
                quote: 'The analytics dashboard alone is worth it. I can finally see where work gets stuck without asking anyone.',
                name: 'Emily Rodriguez',
                role: 'Engineering Manager'
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    borderRight: { md: index < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#a1a1aa', mb: 4 }}>
                    "{item.quote}"
                  </Typography>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fafafa' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3f3f46' }}>
                      {item.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CTA ─── */}
      <Box sx={{ py: { xs: 12, md: 20 }, borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        {/* CTA ambient glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '700px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#fafafa',
                mb: 3
              }}
            >
              Ready to build?
            </Typography>
            <Typography sx={{ fontSize: '1.05rem', color: '#52525b', mb: 5, lineHeight: 1.6 }}>
              Free to use. Set up in under a minute.
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
              sx={{
                bgcolor: '#fafafa',
                color: '#111113',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: '100px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#e4e4e7', boxShadow: 'none' }
              }}
            >
              Get started for free
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* ─── Footer ─── */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="img"
                src={assets.images.logo}
                alt="Kanvo"
                sx={{ width: 20, height: 20, objectFit: 'contain', opacity: 0.4 }}
              />
              <Typography sx={{ fontSize: '0.75rem', color: '#27272a' }}>
                2025 Kanvo. All rights reserved.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['GitHub', 'Twitter'].map((link) => (
                <Typography
                  key={link}
                  component="a"
                  href="#"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#3f3f46',
                    textDecoration: 'none',
                    '&:hover': { color: '#a1a1aa' },
                    transition: 'color 0.2s'
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Landing
