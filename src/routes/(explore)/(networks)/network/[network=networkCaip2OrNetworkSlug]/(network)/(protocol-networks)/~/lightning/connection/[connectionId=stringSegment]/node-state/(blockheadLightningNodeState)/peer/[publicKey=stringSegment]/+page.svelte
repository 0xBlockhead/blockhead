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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadLightningPeer, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPeerView from '$/views/BlockheadLightningPeerView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'local LND peer')} • local LND peer • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPeerView
		selection={pageSelection}
	/>
</Page>
