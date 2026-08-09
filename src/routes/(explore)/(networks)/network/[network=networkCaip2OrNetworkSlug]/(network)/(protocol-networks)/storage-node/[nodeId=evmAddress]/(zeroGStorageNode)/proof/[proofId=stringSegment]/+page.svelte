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

	const pageSelection = $derived(select(EntityType.ZeroGStorageProof, {
		$storageNode: data.selector,
		proofId: params.proofId,
	}, {
		sources: [
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGStorageProofView from '$/views/ZeroGStorageProofView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.proofId || 'zero g storage proof')} • zero g storage proof • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGStorageProofView
		selection={pageSelection}
	/>
</Page>
