export const formatDate = (pubDate: Date | string) => {
	var options: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	const normalizedDate = pubDate instanceof Date ? pubDate : new Date(pubDate);
	return normalizedDate.toLocaleDateString('en-US', options);
};
