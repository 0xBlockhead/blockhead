<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmUserOperation, data.selector, {
				sources: [
					Source.Blockscout_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.hash || 'User operation')} • User operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'User operation'} • User operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmUserOperation, data.selector, {
				sources: [
					Source.Blockscout_Rest,
				],
			})}

	<EvmUserOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
