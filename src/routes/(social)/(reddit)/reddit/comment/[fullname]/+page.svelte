<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<Page>
	<RedditCommentView
		href={
			resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
				fullname: params.fullname,
			})
		}
		selection={
			select(EntityType.RedditComment, {
				fullname: decodeURIComponent(params.fullname),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					body: true,
					createdAt: true,
					author: true,
					depth: true,
					$link: true,
					$parentComment: true,
				},
			})
		}
	/>
</Page>
