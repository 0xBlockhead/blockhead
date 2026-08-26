<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaNft, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.serialNumber) || 'hedera NFT')} • hedera NFT • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera NFT'} • hedera NFT • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaNftView
		selection={pageSelection}
	/>
	{/if}
</Page>
