// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import GitForgePullRequestSchema from '$/schema/GitForgePullRequest.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeInteger(params.pullRequestNumber)))
		error(404, 'Route mapping not applicable')

	const gitForgePullRequestForgeMirrorPullRequestNumberSelector = parseEntitySelector(
		schema,
		GitForgePullRequestSchema,
		{
			$forgeMirror: parentData.selector,
			pullRequestNumber: Number(params.pullRequestNumber),
		},
		'ForgeMirrorPullRequestNumber'
	)
	if (gitForgePullRequestForgeMirrorPullRequestNumberSelector instanceof arktype.errors)
		error(404, 'Invalid GitForgePullRequest selector')

	return {
		selector: gitForgePullRequestForgeMirrorPullRequestNumberSelector,
	}
}
