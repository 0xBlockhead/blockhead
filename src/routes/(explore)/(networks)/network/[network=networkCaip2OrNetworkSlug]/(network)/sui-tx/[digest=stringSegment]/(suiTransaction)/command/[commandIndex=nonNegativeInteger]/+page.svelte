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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiProgrammableTransactionCommand, {
		$transaction: data.selector,
		commandIndex: Number(params.commandIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiProgrammableTransactionCommandView from '$/views/SuiProgrammableTransactionCommandView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui programmable transaction command'} • Sui programmable transaction command • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui programmable transaction command'} • Sui programmable transaction command • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiProgrammableTransactionCommandView
		selection={pageSelection}
	/>
	{/if}
</Page>
