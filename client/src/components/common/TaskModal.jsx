import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '@mui/material/styles';
import taskApi from '../../api/taskApi';

import '../../css/custom-editor.css'; 

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%',
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const editorWrapperRef = useRef();

  const theme = useTheme();

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : '');
    setContent(props.task !== undefined ? props.task.content : '');
    setPriority(props.task !== undefined ? (props.task.priority || 'medium') : 'medium');
    setStatus(props.task !== undefined ? (props.task.status || 'todo') : 'todo');
    setDueDate(props.task !== undefined && props.task.dueDate ? Moment(props.task.dueDate).format('YYYY-MM-DD') : '');
    setTags(props.task !== undefined ? (props.task.tags || []) : []);
    if (props.task !== undefined) {
      isModalClosed = false;
    }
  }, [props.task]);

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };

  const updateContent = async (content) => {
    clearTimeout(timer);

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content });
        } catch (err) {
          alert(err);
        }
      }, timeout);

      task.content = content;
      setContent(content);
      props.onUpdate(task);
    }
  };

  const updatePriority = async (newPriority) => {
    clearTimeout(timer);
    setPriority(newPriority);
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { priority: newPriority });
        task.priority = newPriority;
        props.onUpdate(task);
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateStatus = async (newStatus) => {
    clearTimeout(timer);
    setStatus(newStatus);
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { status: newStatus });
        task.status = newStatus;
        props.onUpdate(task);
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateDueDate = async (newDueDate) => {
    clearTimeout(timer);
    setDueDate(newDueDate);
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { dueDate: newDueDate ? new Date(newDueDate) : null });
        task.dueDate = newDueDate ? new Date(newDueDate) : null;
        props.onUpdate(task);
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const addTag = async (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
      try {
        await taskApi.update(boardId, task.id, { tags: newTags });
        task.tags = newTags;
        props.onUpdate(task);
      } catch (err) {
        alert(err);
      }
    }
  };

  const removeTag = async (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    try {
      await taskApi.update(boardId, task.id, { tags: newTags });
      task.tags = newTags;
      props.onUpdate(task);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <IconButton variant="outlined" color="error" onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 5rem 5rem',
            }}
          >
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px',
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => updatePriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => updateStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                type="date"
                label="Due Date"
                value={dueDate}
                onChange={(e) => updateDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={addTag}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            <Typography variant="body2" fontWeight="700">
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <ReactQuill
                value={content}
                onChange={updateContent}
                theme="snow"
                className={theme.palette.mode === 'light' ? 'ql-editor-light' : 'ql-editor-dark'} // Apply conditional class
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
