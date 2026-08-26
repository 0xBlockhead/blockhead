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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandAccount, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand account'} • algorand account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand account'} • algorand account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
