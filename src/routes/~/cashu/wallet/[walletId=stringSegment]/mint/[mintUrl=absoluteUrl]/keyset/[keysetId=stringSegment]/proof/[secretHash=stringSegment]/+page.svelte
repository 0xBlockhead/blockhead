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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuProof, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuProofView from '$/views/BlockheadCashuProofView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.secretHash || 'blockhead Cashu proof')} • blockhead Cashu proof • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu proof'} • blockhead Cashu proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadCashuProofView
		selection={pageSelection}
	/>
	{/if}
</Page>
