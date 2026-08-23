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


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaNft, data.selector)}
		<title>{data?.title ?? (String(pageSelection.entitySelector.serialNumber) || 'hedera NFT')} • hedera NFT • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera NFT'} • hedera NFT • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaNft, data.selector)}

	<HederaNftView
		selection={pageSelection}
	/>
	{/if}
</Page>
