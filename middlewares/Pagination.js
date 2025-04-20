const Pagination = (data, total, currentPage, perPage) => {
	const lastPage = Math.ceil(total / perPage)
	const from = (currentPage - 1) * perPage + 1
	const to = Math.min(currentPage * perPage, total)
	const baseUrl = 'http://localhost:8000/api/get-images'

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
		per_page: perPage,
		prev_page_url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
		to,
		total
	}
}

export default Pagination
