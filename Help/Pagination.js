const Pagination = (data, total, currentPage) => {
	const lastPage = Math.ceil(total / 8)
	const from = (currentPage - 1) * 8 + 1
	const to = Math.min(currentPage * 8, total)
	const baseUrl = 'https://omni-back-pearl.vercel.app/api/get-images'

	const links = []

	for (let i = 1; i <= lastPage; i++) {
		links.push({
			url: `${baseUrl}?page=${i}`,
			label: `${i}`,
			active: i === currentPage
		})
	}

	return {
		current_page: currentPage,
		data: data,
		first_page_url: `${baseUrl}?page=1`,
		from,
		last_page: lastPage,
		last_page_url: `${baseUrl}?page=${lastPage}`,
		links,
		next_page_url: currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
		path: baseUrl,
		per_page: 8,
		prev_page_url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
		to,
		total
	}
}

export default Pagination
