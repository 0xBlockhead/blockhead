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
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
</script>


<svelte:head>
	<title>Reddit submission timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditLink_TimestampView
		href={
			resolve('/(social)/(reddit)/reddit/link/[fullname]/(link)/observations/[timestampMs=nonNegativeInteger]/[source]', {
				fullname: params.fullname,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.RedditLink_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					score: true,
					commentCount: true,
				},
			})
		}
	/>
</Page>
