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

	const pageSelection = $derived(select(EntityType.FilecoinMiner, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.minerAddress || 'filecoin miner')} • filecoin miner • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMinerView
		selection={pageSelection}
	/>
</Page>
