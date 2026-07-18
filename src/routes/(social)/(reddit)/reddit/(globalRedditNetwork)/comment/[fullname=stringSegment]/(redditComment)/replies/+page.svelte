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
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<svelte:head>
	<title>Replies • Blockhead</title>
</svelte:head>


<Page>
	<RedditCommentsView
		href={
			resolve('/reddit/comment/[fullname=stringSegment]/replies', {
				fullname: params.fullname,
			})
		}
		title='Replies'
		selection={
			select(EntityType.RedditComment, {
				fullname: decodeURIComponent(params.fullname),
			}).$$replies({
				sources: [
					Source.Constants_Internal,
					Source.Reddit_PublicJson,
				],
				count: true,
			})
		}
		id='replies'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
