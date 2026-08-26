<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RoyaltyRight_TimestampView from '$/views/RoyaltyRight_TimestampView.svelte'
</script>


<svelte:head>
	<title>royalty right timestamp • royalty right timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RoyaltyRight_TimestampView
		selection={
			select(EntityType.RoyaltyRight_Timestamp, {
				targetKey: params.targetKey,
				rightKey: params.rightKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
