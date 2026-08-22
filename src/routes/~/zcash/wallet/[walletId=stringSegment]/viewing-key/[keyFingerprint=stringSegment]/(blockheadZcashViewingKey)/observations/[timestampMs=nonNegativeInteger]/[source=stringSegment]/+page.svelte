<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadZcashViewingKey_Timestamp, {
		$viewingKey: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZcashViewingKey_TimestampView from '$/views/BlockheadZcashViewingKey_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead zcash viewing key timestamp')} • blockhead zcash viewing key timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadZcashViewingKey_TimestampView
		selection={pageSelection}
	/>
</Page>
