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
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandAccount, data.selector)}
		<title>{data?.title ?? 'algorand account'} • algorand account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand account'} • algorand account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandAccount, data.selector)}

	<AlgorandAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
