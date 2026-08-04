<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
</script>


<svelte:head>
	<title>ActivityPub note observation • ActivityPub note observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNote_TimestampView
		selection={
			select(EntityType.ActivityPubNote_Timestamp, {
				$note: {
					instanceOrigin: decodeURIComponent(params.instanceOrigin),
					localStatusId: params.localStatusId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
