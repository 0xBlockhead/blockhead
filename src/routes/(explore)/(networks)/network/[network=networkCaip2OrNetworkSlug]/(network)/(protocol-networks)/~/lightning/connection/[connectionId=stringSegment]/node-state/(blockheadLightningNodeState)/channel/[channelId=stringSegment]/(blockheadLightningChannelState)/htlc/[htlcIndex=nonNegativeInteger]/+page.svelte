<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadLightningHtlc, {
		$channelState: data.selector,
		htlcIndex: Number(params.htlcIndex),
	}, {
		sources: [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningHtlcView from '$/views/BlockheadLightningHtlcView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'HTLC ' + String(pageSelection.entitySelector.htlcIndex)} • local LND HTLC • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningHtlcView
		selection={pageSelection}
	/>
</Page>
