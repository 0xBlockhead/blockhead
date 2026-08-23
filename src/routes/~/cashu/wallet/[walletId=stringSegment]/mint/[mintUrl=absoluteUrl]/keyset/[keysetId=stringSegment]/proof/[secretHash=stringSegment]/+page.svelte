<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuProofView from '$/views/BlockheadCashuProofView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadCashuProof, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.secretHash || 'blockhead Cashu proof')} • blockhead Cashu proof • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead Cashu proof'} • blockhead Cashu proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadCashuProof, data.selector))}

		<BlockheadCashuProofView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
