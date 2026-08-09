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

	const pageSelection = $derived(select(EntityType.NearContractStorageEntry, {
		$contract: data.selector,
		keyBase64: params.keyBase64,
		blockHeight: BigInt(params.blockHeight),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearContractStorageEntryView from '$/views/NearContractStorageEntryView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.keyBase64 || 'near contract storage entry')} • near contract storage entry • Blockhead</title>
</svelte:head>


<Page>
	<NearContractStorageEntryView
		selection={pageSelection}
	/>
</Page>
