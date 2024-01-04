import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

const StoryForm = ({ initialStoryData, onSubmit, genres }) => {
  const [formData, setFormData] = useState(initialStoryData || {
    title: '', author: '', genre: '', imageUrl: '', defaultVoice: { narrator: '', audioUrl: '', language: '' }
  });

  useEffect(() => {
    setFormData(initialStoryData || {
      title: '', author: '', genre: '', imageUrl: '', defaultVoice: { narrator: '', audioUrl: '', language: '' }
    });
  }, [initialStoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('defaultVoice.')) {
      const voiceField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        defaultVoice: { ...prevData.defaultVoice, [voiceField]: value }
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Title" required>
        <Input name="title" value={formData.title} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Author" required>
        <Input name="author" value={formData.author} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Genre" required>
        <Select
          name="genre"
          value={formData.genre}
          onChange={(value) => setFormData({ ...formData, genre: value })}
        >
          {genres.map(genre => (
            <Select.Option key={genre._id} value={genre._id}>{genre.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Image URL" required>
        <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Default Voice Narrator" required>
        <Input name="defaultVoice.narrator" value={formData.defaultVoice.narrator} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Default Voice Audio URL" required>
        <Input name="defaultVoice.audioUrl" value={formData.defaultVoice.audioUrl} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Default Voice Language" required>
        <Input name="defaultVoice.language" value={formData.defaultVoice.language} onChange={handleChange} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default StoryForm;
