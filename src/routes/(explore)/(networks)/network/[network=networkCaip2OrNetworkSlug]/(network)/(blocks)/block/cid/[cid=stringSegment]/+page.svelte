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

	const pageSelection = $derived(select(EntityType.FilecoinBlock, {
		$network: data.selector,
		cid: params.cid,
	}, {
		sources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinBlockView from '$/views/FilecoinBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.cid || 'filecoin block')} • filecoin block • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinBlockView
		selection={pageSelection}
	/>
</Page>
