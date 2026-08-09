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

	const pageSelection = $derived(select(EntityType.FilecoinTipset, {
		$network: data.selector,
		height: BigInt(params.height),
		tipsetKey: params.tipsetKey,
	}, {
		sources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.height) || 'filecoin tipset')} • filecoin tipset • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinTipsetView
		selection={pageSelection}
	/>
</Page>
