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

	const pageSelection = $derived(select(EntityType.PolkadotEvent, {
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}, {
		fields: {
			eventName: true,
			$pallet: true,
			$extrinsic: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Event ' + String(pageSelection.entitySelector.indexInBlock ?? '') : [pageSelection.entity.eventName, 'Event ' + String(pageSelection.entitySelector.indexInBlock)].filter(Boolean).join(' ') || 'Polkadot event')} • Polkadot event • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotEventView
		selection={pageSelection}
	/>
</Page>
