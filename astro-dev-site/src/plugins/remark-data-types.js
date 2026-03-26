// remark-data-types.js
// Transforms {: data-type="..." } markdown syntax into HTML data attributes
// This allows clean markdown while generating semantic HTML for CSS selectors

import { visit } from 'unist-util-visit';

export default function remarkDataTypes() {
  console.log('=========== REMARK PLUGIN CALLED ===========');

  return (tree, file) => {
    console.log(`Processing file: ${file.path || 'unknown'}`);
    console.log(`Tree root has ${tree.children?.length || 0} children`);

    const nodesToRemove = [];
    let attributesFound = 0;
    let paragraphsInspected = 0;

    visit(tree, (node, index, parent) => {
      if (node.type === 'paragraph') {
        paragraphsInspected++;

        if (parent && typeof index === 'number') {
          // Check if the paragraph contains only the attribute syntax
          if (node.children && node.children.length === 1 && node.children[0].type === 'text') {
            const text = node.children[0].value;

            if (text.includes('{:')) {
              console.log(`Found potential attribute paragraph at index ${index}: "${text.substring(0, 50)}"`);
            }

            const match = text.trim().match(/^\{\s*:\s*data-type="([^"]+)"\s*\}$/);

            if (match && index > 0) {
              attributesFound++;
              const dataType = match[1];
              const previousNode = parent.children[index - 1];

              console.log(`✓ Found attribute: data-type="${dataType}" for previous node type: ${previousNode.type}`);

              // Add data-type attribute to previous node
              if (previousNode && (previousNode.type === 'paragraph' || previousNode.type === 'blockquote')) {
                previousNode.data = previousNode.data || {};
                previousNode.data.hProperties = previousNode.data.hProperties || {};
                previousNode.data.hProperties['data-type'] = dataType;

                console.log(`✓ Applied data-type="${dataType}" to ${previousNode.type}`);

                // Mark this node for removal
                nodesToRemove.push({ parent, index });
              }
            }
          }
        }
      }
    });

    // Remove attribute nodes in reverse order to avoid index shifting
    nodesToRemove.reverse().forEach(({ parent, index }) => {
      parent.children.splice(index, 1);
    });

    console.log(`\nREMARK PLUGIN SUMMARY:`);
    console.log(`- Paragraphs inspected: ${paragraphsInspected}`);
    console.log(`- Attributes found: ${attributesFound}`);
    console.log(`- Nodes removed: ${nodesToRemove.length}`);
    console.log('============================================\n');
  };
}
