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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadCashuProof, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuProofView from '$/views/BlockheadCashuProofView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.secretHash || 'blockhead Cashu proof')} • blockhead Cashu proof • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuProofView
		selection={pageSelection}
	/>
</Page>
