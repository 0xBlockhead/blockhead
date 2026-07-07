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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
</script>


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
			select(EntityType.RedditComment_Timestamp, {
				$comment: {
					fullname: decodeURIComponent(params.fullname),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$comment: {
					fullname: decodeURIComponent(params.fullname),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					score: true,
				},
			})
		}
	/>
</Page>
