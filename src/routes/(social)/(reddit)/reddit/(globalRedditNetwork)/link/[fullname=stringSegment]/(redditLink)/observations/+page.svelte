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
	import RedditLink_TimestampsView from '$/views/RedditLink_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Submission observations • Blockhead</title>
</svelte:head>


<Page>
	<RedditLink_TimestampsView
		href={
			resolve('/reddit/link/[fullname=stringSegment]/observations', {
				fullname: params.fullname,
			})
		}
		title='Submission observations'
		selection={
			select(EntityType.RedditLink, {
				fullname: decodeURIComponent(params.fullname),
			}).$$timestamps({
				sources: [
					Source.Reddit_PublicJson,
				],
				count: true,
			})
		}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
