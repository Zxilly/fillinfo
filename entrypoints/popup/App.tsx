import React, { useState, useEffect } from 'react';
import { OpenAI } from 'openai';
import './App.css';

export default function() {
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [model, setModel] = useState('');
  const [filename, setFileName] = useState('');

  useEffect(() => {
    browser.storage.local.get(['apiKey', 'apiEndpoint']).then((result) => {
      if (result.apiKey) setApiKey(result.apiKey as string);
      if (result.apiEndpoint) setApiEndpoint(result.apiEndpoint as string);
      if (result.model) setModel(result.model as string);
      if (result.filename) setFileName(result.filename as string);
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          browser.storage.local.set({ file: e.target.result });
        }
      };
      setFileName(e.target.files[0].name);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveSettings = () => {
    browser.storage.local.set({ apiKey, apiEndpoint, file: file });
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
    saveSettings();
  };

  return (
    <div className="settings">
      <h2>设置</h2>
      <div>
        <label>OpenAI Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <div>
        <label>OpenAI Endpoint:</label>
        <input
          type="text"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
        />
      </div>
      <div>
        <label>模型:</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>
      <div>
        <label>参考文件:</label>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      <button onClick={testApi}>测试 API</button>
    </div>
  );
}