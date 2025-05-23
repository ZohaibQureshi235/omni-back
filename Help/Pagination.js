const Pagination = (data, total, currentPage, url) => {
	const lastPage = Math.ceil(total / 16)
	const from = (currentPage - 1) * 16 + 1
	const to = Math.min(currentPage * 16, total)
	const baseUrl = `https://omni-back-pearl.vercel.app/api/${url}`

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
		per_page: 16,
		prev_page_url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
		to,
		total
	}
}

export default Pagination
