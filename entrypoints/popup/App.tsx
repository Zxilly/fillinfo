import React from 'react';
import {OpenAI} from 'openai';
import {useStorage} from "@/entrypoints/hooks/useStorage.ts";
import {readFile} from "@/entrypoints/utils/utils";
import { Form, Button } from 'react-bootstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function () {
  const {data: apiKey, updateData: setApiKey} = useStorage('apiKey', '');
  const {data: apiEndpoint, updateData: setApiEndpoint} = useStorage('apiEndpoint', '');
  const {data: model, updateData: setModel} = useStorage('model', '');
  const {data: file, updateData: setFile} = useStorage('file', '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]).then((content) => {
        if (content.length > 2048) {
          alert('文件大小不能超过 2k');
          e.target.value = '';
          return;
        }
        setFile(content);
      })
    }
  };

  const testApi = async () => {
    if (!apiKey || !apiEndpoint || !model) {
      alert('请填写API Key, Endpoint 和 Model');
      return;
    }
    const openai = new OpenAI({
      apiKey,
      baseURL: apiEndpoint,
      dangerouslyAllowBrowser: true
    });
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: '你好'
          }
        ]
      })
      console.log(response.choices[0].message.content);
      alert('API 测试成功');
    } catch (error) {
      console.error(error);
      alert('API 测试失败');
    }
  };

  return (
    <div className="settings">
      <h2>设置</h2>
      <Form>
        <Form.Group controlId="apiKey">
          <Form.Label>OpenAI Key:</Form.Label>
          <Form.Control
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="apiEndpoint">
          <Form.Label>OpenAI Endpoint:</Form.Label>
          <Form.Control
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="model">
          <Form.Label>模型:</Form.Label>
          <Form.Control
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="referenceFile">
          <Form.Label>参考文件:</Form.Label>
          <Form.Text>文件大小: {file?.length ?? 0}</Form.Text>
          <Form.Control type="file" accept=".txt" onChange={handleFileUpload} />
        </Form.Group>

        <Button variant="primary" onClick={testApi}>
          测试 API
        </Button>
      </Form>
    </div>
  );
}
