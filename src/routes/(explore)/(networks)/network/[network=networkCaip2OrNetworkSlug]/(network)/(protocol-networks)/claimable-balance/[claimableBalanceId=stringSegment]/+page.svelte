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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarClaimableBalance, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarClaimableBalanceView from '$/views/StellarClaimableBalanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar claimable balance'} • stellar claimable balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar claimable balance'} • stellar claimable balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarClaimableBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
