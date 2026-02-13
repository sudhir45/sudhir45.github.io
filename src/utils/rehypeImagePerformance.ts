export const rehypeImagePerformance = () => {
	return (tree: any) => {
		const visit = (node: any) => {
			if (!node || typeof node !== 'object') {
				return;
			}

			if (node.type === 'element' && node.tagName === 'img') {
				node.properties ??= {};

				if (node.properties.loading == null) {
					node.properties.loading = 'lazy';
				}
				if (node.properties.decoding == null) {
					node.properties.decoding = 'async';
				}
			}

			if (Array.isArray(node.children)) {
				for (const child of node.children) {
					visit(child);
				}
			}
		};

		visit(tree);
	};
};
