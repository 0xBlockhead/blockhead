export const xUserSelectorFromRouteParam = (
	userId: string
) => /^\d+$/.test(userId) ?
	{
		id: userId,
	}
:
	{
		username: userId.replace(/^@/, ''),
	}
