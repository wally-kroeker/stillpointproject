#!/bin/bash

# Local Content Processing Script for StillPoint Project
# Processes novel content from source into Hugo site structure
# Adapted from production script for local development

# --- Configuration ---
NOVEL_SRC_DIR="../novel/scenes"
HUGO_CONTENT_DIR="content/novel"

# --- Content Processing ---
echo "=== Processing Novel Content for Hugo ==="
echo "Source: $NOVEL_SRC_DIR"
echo "Destination: $HUGO_CONTENT_DIR"

# Clean and recreate content directory
if [ -d "$HUGO_CONTENT_DIR" ]; then
    echo "Cleaning existing content..."
    rm -rf "$HUGO_CONTENT_DIR"
fi
mkdir -p "$HUGO_CONTENT_DIR"

# Process prologue first (if it exists)
if [ -f "../novel/prologue_the_stillness.md" ]; then
    echo "Processing prologue..."

    # Extract content starting from line 27 (after YAML header)
    body_content=$(sed -n '27,$p' "../novel/prologue_the_stillness.md" | sed 's/\[\[//g; s/\]\]//g')

    # Create Hugo version with proper front matter
    {
        echo "---"
        echo "title: \"Prologue: The Stillness\""
        echo "date: $(date --iso-8601=seconds)"
        echo "weight: 1000000"
        echo "---"
        echo ""
        echo "$body_content"
    } > "$HUGO_CONTENT_DIR/prologue_the_stillness.md"

    echo "✅ Prologue processed"
fi

# Process all scene files
if [ -d "$NOVEL_SRC_DIR" ]; then
    processed_count=0

    find "$NOVEL_SRC_DIR" -name "*.md" | while read -r filepath; do
        filename=$(basename -- "$filepath")
        core_name="${filename%.*}"

        # Default values
        title="$core_name"
        weight=0

        # Check if filename matches structured format (e.g., e1_c01_s01_the_daydream)
        if [[ "$core_name" =~ ^(e[0-9]+_c[0-9]+_s[0-9]+)_(.*)$ ]]; then
            weight_str="${BASH_REMATCH[1]}"
            title_str="${BASH_REMATCH[2]}"

            # Format title: replace underscores with spaces and capitalize
            title=$(echo "$title_str" | tr '_' ' ' | sed -e "s/\b\(.\)/\u\1/g")

            # Generate numerical weight for sorting (e.g., e1_c01_s01 becomes 10101)
            weight=$(echo "$weight_str" | sed -e 's/e//' -e 's/c/0/' -e 's/s/0/' | tr -d '_')
        fi

        # Extract front matter and content
        original_frontmatter=$(sed -n '2,/^---$/p' "$filepath" | sed '$d')
        body_content=$(sed '1,/^---$/d' "$filepath" | sed '1,/^---$/d' | sed 's/\[\[//g; s/\]\]//g')

        # Remove title from original frontmatter to avoid duplicates
        original_frontmatter_no_title=$(echo "$original_frontmatter" | grep -v '^title:')

        # Create Hugo version
        {
            echo "---"
            echo "title: \"$title\""
            echo "date: $(date --iso-8601=seconds)"
            echo "weight: $weight"
            echo "$original_frontmatter_no_title"
            echo "---"
            echo ""
            echo "$body_content"
        } > "$HUGO_CONTENT_DIR/$filename"

        echo "✅ Processed: $filename -> '$title' (weight: $weight)"
        processed_count=$((processed_count + 1))
    done

    echo "📊 Processed $processed_count scene files"
else
    echo "⚠️ No scenes directory found at $NOVEL_SRC_DIR"
fi

echo "=== Content Processing Complete ==="