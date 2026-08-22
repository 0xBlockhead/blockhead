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

	const pageSelection = $derived(select(EntityType.StarknetStorageEntry, data.selector, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.storageKey || 'starknet storage entry')} • starknet storage entry • Blockhead</title>
</svelte:head>


<Page>
	<StarknetStorageEntryView
		selection={pageSelection}
	/>
</Page>
