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

	const pageSelection = $derived(select(EntityType.BridgeRoute, data.selector, {
		sources: [
			Source.Lifi_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ([String(pageSelection.entitySelector.fromChainId), 'to', String(pageSelection.entitySelector.toChainId)].filter(Boolean).join(' ') || 'bridge route')} • bridge route • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteView
		selection={pageSelection}
	/>
</Page>
