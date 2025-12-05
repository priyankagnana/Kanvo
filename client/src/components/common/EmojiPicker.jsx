import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = (props) => {
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [isShowPicker, setIsShowPicker] = useState(false);

  useEffect(() => {
    setSelectedEmoji(props.icon || '🙂');
  }, [props.icon]);

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji.native); 
    setIsShowPicker(false);
    if (props.onEmojiSelect) {
        props.onEmojiSelect(emoji.native); 
    }
};

  const showPicker = () => setIsShowPicker(!isShowPicker);

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{ cursor: 'pointer' }}
        onClick={showPicker}
      >
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPicker ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: 9999,
        }}
      >
        <Picker
          data={data}
          theme="dark"
          onEmojiSelect={selectEmoji}
          showPreview={false}
        />
      </Box>
    </Box>
  );
};

export default EmojiPicker;
