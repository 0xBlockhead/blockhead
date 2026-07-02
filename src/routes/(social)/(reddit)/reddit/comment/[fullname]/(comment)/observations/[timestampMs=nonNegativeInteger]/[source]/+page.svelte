<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
</script>


<svelte:head>
	<title>Reddit comment timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditComment_TimestampView
		href={
			resolve('/(social)/(reddit)/reddit/comment/[fullname]/(comment)/observations/[timestampMs=nonNegativeInteger]/[source]', {
				fullname: params.fullname,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.RedditComment_Timestamp, data.selector, {
				fields: {
					score: true,
				},
			})
		}
	/>
</Page>
