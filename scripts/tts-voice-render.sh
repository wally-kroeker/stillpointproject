#!/usr/bin/env bash
# TTS Voice Render — sends each tagged chunk to Kokoro TTS with character-specific voices
# Usage: ./scripts/tts-voice-render.sh novel/pebble-year-voiced.md output-dir/

set -eo pipefail

INPUT="${1:?Usage: $0 <voiced-script.md> <output-dir>}"
OUTDIR="${2:?Usage: $0 <voiced-script.md> <output-dir>}"
API="http://walub.kroeker.fun:8880/v1/audio/speech"

mkdir -p "$OUTDIR"

# Voice casting
declare -A VOICES
VOICES[NARRATOR]="bf_emma"
VOICES[NARRATOR-AS-ADULT]="bf_alice"
VOICES[KAIA]="af_bella"
VOICES[LUM]="bf_lily"
VOICES[REN]="af_sarah"
VOICES[ELDER_TANNIS]="bf_alice"
VOICES[OMA_DEVI]="af_nicole"
VOICES[NANA_SOLEIL]="af_heart"
VOICES[FEN]="am_puck"
VOICES[MAHA]="af_sky"
VOICES[BRIN]="am_eric"

# Speed per character — tuned for ~150wpm natural narration pace
declare -A SPEEDS
SPEEDS[NARRATOR]="0.8"
SPEEDS[NARRATOR-AS-ADULT]="0.75"
SPEEDS[KAIA]="0.85"
SPEEDS[LUM]="0.7"
SPEEDS[REN]="0.78"
SPEEDS[ELDER_TANNIS]="0.7"
SPEEDS[OMA_DEVI]="0.65"
SPEEDS[NANA_SOLEIL]="0.8"
SPEEDS[FEN]="0.9"
SPEEDS[MAHA]="0.9"
SPEEDS[BRIN]="0.78"

# Parse the script into chunks
CHUNK_NUM=0
CURRENT_VOICE=""
CURRENT_TEXT=""

flush_chunk() {
    # Trim whitespace
    local text
    text="$(echo "$CURRENT_TEXT" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr '\n' ' ' | sed 's/  */ /g')"

    # Skip empty chunks, header lines, horizontal rules
    if [[ -z "$text" ]] || [[ "$text" == "---" ]] || [[ "$text" =~ ^#.* ]]; then
        return
    fi

    CHUNK_NUM=$((CHUNK_NUM + 1))
    local padded
    padded=$(printf "%04d" "$CHUNK_NUM")
    local voice="${VOICES[$CURRENT_VOICE]:-bf_emma}"
    local speed="${SPEEDS[$CURRENT_VOICE]:-1.0}"
    local outfile="$OUTDIR/${padded}_${CURRENT_VOICE}.mp3"

    echo "[$padded] ${CURRENT_VOICE} (${voice}, speed=${speed}) — ${#text} chars"

    # Escape text for JSON
    local json_text
    json_text="$(echo "$text" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read().strip()))')"

    curl -s -X POST "$API" \
        -H "Content-Type: application/json" \
        -d "{
            \"model\": \"kokoro\",
            \"input\": ${json_text},
            \"voice\": \"${voice}\",
            \"response_format\": \"mp3\",
            \"speed\": ${speed}
        }" \
        --output "$outfile"

    local size
    size=$(stat -c%s "$outfile" 2>/dev/null || echo 0)
    if [[ "$size" -lt 1000 ]]; then
        echo "  ⚠️  WARNING: Output file is very small (${size} bytes) — may have failed"
    fi
}

echo "═══════════════════════════════════════"
echo "  Pebble Year — Multi-Voice TTS Render"
echo "═══════════════════════════════════════"
echo ""
echo "Voice Cast:"
for role in NARRATOR KAIA LUM REN ELDER_TANNIS OMA_DEVI NANA_SOLEIL FEN MAHA BRIN; do
    echo "  ${role}: ${VOICES[$role]}"
done
echo ""
echo "Processing..."
echo ""

while IFS= read -r line; do
    # Check for voice tag
    if [[ "$line" =~ ^\[([A-Z_-]+)\]$ ]]; then
        # Flush previous chunk
        if [[ -n "$CURRENT_VOICE" && -n "$CURRENT_TEXT" ]]; then
            flush_chunk
        fi
        CURRENT_VOICE="${BASH_REMATCH[1]}"
        CURRENT_TEXT=""
    else
        CURRENT_TEXT="${CURRENT_TEXT}${line}
"
    fi
done < "$INPUT"

# Flush last chunk
if [[ -n "$CURRENT_VOICE" && -n "$CURRENT_TEXT" ]]; then
    flush_chunk
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Generated ${CHUNK_NUM} audio chunks"
echo "  Output: ${OUTDIR}/"
echo "═══════════════════════════════════════"
echo ""

# Generate concat list for ffmpeg
echo "Generating merge file list..."
ls -1 "$OUTDIR"/*.mp3 | sort | while read -r f; do
    echo "file '$(realpath "$f")'"
done > "$OUTDIR/concat.txt"

echo "Merging all chunks..."
ffmpeg -y -f concat -safe 0 -i "$OUTDIR/concat.txt" \
    -c:a libmp3lame -q:a 2 \
    "$OUTDIR/../pebble-year-voiced.mp3" 2>/dev/null

FINAL_SIZE=$(du -h "$OUTDIR/../pebble-year-voiced.mp3" | cut -f1)
echo ""
echo "✅ Final output: ${OUTDIR}/../pebble-year-voiced.mp3 (${FINAL_SIZE})"
echo "   ${CHUNK_NUM} chunks merged"
