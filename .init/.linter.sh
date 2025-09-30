#!/bin/bash
cd /home/kavia/workspace/code-generation/multi-agent-chatbot-system-2879-2888/chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

