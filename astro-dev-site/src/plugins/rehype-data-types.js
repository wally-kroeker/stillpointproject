// rehype-data-types.js
// Processes HTML tree to add data-type attributes based on `{: data-type="..." }` markers

import { visit } from 'unist-util-visit';

import { writeFileSync, appendFileSync } from 'fs';
import { dirname } from 'path';

export default function rehypeDataTypes() {
  return (tree) => {
    const logFile = '/tmp/rehype-plugin.log';
    appendFileSync(logFile, `[${new Date().toISOString()}] Plugin called\n`);

    // First pass: collect all markers and their target nodes
    const updates = [];
    let debugCount = 0;

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number' || index === 0) return;

      // Look for paragraphs containing ONLY the marker pattern
      if (node.type === 'element' && node.tagName === 'p') {
        // Extract text from all text nodes in this paragraph
        let text = '';

        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            if (child.type === 'text') {
              text += child.value;
            }
          }
        }

        if (text) {
          // Match the marker pattern: {: data-type="..." }
          // This matches the exact pattern in the markdown
          const match = text.trim().match(/^{\s*:\s*data-type="([^"]+)"\s*}$/);

          if (match) {
            debugCount++;
            const dataType = match[1];
            const previousNode = parent.children[index - 1];

            if (previousNode && previousNode.type === 'element') {
              updates.push({
                nodeToUpdate: previousNode,
                dataType,
                markerIndex: index,
                parent,
              });

              // Log success
              if (debugCount <= 3) {
                console.log(`[rehype-data-types] Found marker: data-type="${dataType}", previous element: <${previousNode.tagName}>`);
              }
            } else {
              // Log failure
              if (debugCount <= 3) {
                console.log(`[rehype-data-types] Found marker but no valid previous element: data-type="${dataType}"`);
              }
            }
          }
        }
      }
    });

    console.log(`[rehype-data-types] Total markers found: ${updates.length}`);

    // Second pass: apply updates in reverse order to preserve indices
    updates.reverse().forEach(({ nodeToUpdate, dataType, markerIndex, parent }) => {
      // Set the data-type attribute
      nodeToUpdate.properties = nodeToUpdate.properties || {};
      nodeToUpdate.properties['data-type'] = dataType;

      // Remove the marker paragraph
      parent.children.splice(markerIndex, 1);
    });
  };
}
