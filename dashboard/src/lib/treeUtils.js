export const buildTagTree = (tags = []) => {
  const root = [];

  // Sort tags by length so parents always come before children
  const sortedTags = [...tags].sort((a, b) => a.split('.').length - b.split('.').length);

  sortedTags.forEach((path) => {
    const parts = path.split('.');
    let currentLevel = root;

    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('.');
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          children: [],
        };
        currentLevel.push(existingNode);
      }
      currentLevel = existingNode.children;
    });
  });

  return root;
};