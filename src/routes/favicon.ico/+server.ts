export const GET = () => new Response(null, {
	status: 307,
	headers: {
		location: '/favicon.svg',
	},
})
