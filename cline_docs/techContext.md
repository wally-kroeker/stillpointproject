# Tech Context

## Overview
This document outlines the technical stack, setup, and architecture for "The StillPoint Project," focusing on the automated audio generation pipeline.

## Audio Generation Pipeline
The pipeline is designed to automatically convert markdown chapters into high-quality audio files. It has been updated to use the OpenAI Text-to-Speech API for superior voice quality and simplified infrastructure.

### Core Technologies
- **Programming Language**: Python 3.11+
- **Package Management**: `uv` (a fast Python package installer and resolver)
- **TTS Engine**: OpenAI Text-to-Speech API (models: `tts-1`, `tts-1-hd`)
- **Audio Processing**: FFmpeg for concatenating and normalizing audio files.

### Workflow
1.  **Change Detection**: The `build_audio.py` script uses `git` to identify new or modified markdown files in the `novel/` directory.
2.  **Text Chunking**: Each chapter is divided into smaller chunks (max 4000 characters) to comply with OpenAI API limits.
3.  **Parallel Synthesis**: The script sends chunks to the OpenAI API in parallel to accelerate audio generation.
4.  **Audio Concatenation**: `ffmpeg` combines the resulting MP3 chunks into a single, chapter-length audio file.
5.  **Deployment**: The final MP3 is deployed to the production server via `rsync`.

## Setup and Configuration

### 1. Environment Setup
The project uses a Python virtual environment managed by `uv`. To set up the environment, run:
```bash
uv venv
uv pip install -r requirements.txt
```

### 2. API Key Management
The OpenAI API key is managed securely using a `.env` file.
1.  Create a file named `.env` in the project root.
2.  Add your API key to the file:
    ```
    OPENAI_API_KEY="your-api-key-here"
    ```
The application will automatically load this key.

### 3. Configuration
The primary configuration file is `ttsframework/config.yaml`. Key settings include:
- `openai_model`: The TTS model to use (e.g., `tts-1-hd`).
- `openai_voice`: The desired voice (e.g., `alloy`, `shimmer`).
- `chunk_chars`: The character limit for each API request.
- `threads`: The number of parallel requests to make.

## Running the Pipeline

-   **Test a single file**: `test.bat`
-   **Build all changed files**: `uv run python build_audio.py`

## Key Technical Decisions
- **Local vs. API-based TTS**: We migrated from a local Coqui TTS setup to the OpenAI API to simplify the stack (no more CUDA dependencies), improve voice quality, and reduce maintenance overhead.
- **Secure API Key Handling**: Using `python-dotenv` allows for secure and flexible API key management without hardcoding credentials.
- **Git-based Change Detection**: Integrating with `git` ensures that only new or modified content is processed, making the pipeline efficient and idempotent.