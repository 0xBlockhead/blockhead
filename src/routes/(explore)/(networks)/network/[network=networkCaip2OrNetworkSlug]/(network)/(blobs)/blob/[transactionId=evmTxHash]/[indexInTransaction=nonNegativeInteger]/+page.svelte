<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmBlob, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.Blobscan_Rest,
		],
		fields: {
			versionedHash: true,
			$block: true,
			kzgCommitment: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Blob #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM blob'))} • EVM blob • Blockhead</title>
</svelte:head>


<Page>
	<EvmBlobView
		selection={pageSelection}
	/>
</Page>
