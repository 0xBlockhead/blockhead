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
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<Page>
	<RedditLinkView
		href={
			resolve('/(social)/(reddit)/reddit/link/[fullname]', {
				fullname: params.fullname,
			})
		}
		selection={
			select(EntityType.RedditLink, {
				fullname: decodeURIComponent(params.fullname),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					title: true,
					createdAt: true,
					selftext: true,
					author: true,
					$subreddit: true,
					url: true,
					permalink: true,
				},
			})
		}
	/>
</Page>
