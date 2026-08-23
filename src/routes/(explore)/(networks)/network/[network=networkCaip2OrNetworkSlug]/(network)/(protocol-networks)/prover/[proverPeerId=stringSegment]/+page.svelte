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
	import QuilibriumProverView from '$/views/QuilibriumProverView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumProver, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.proverPeerId || 'quilibrium prover')} • quilibrium prover • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'quilibrium prover'} • quilibrium prover • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumProver, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}

	<QuilibriumProverView
		selection={pageSelection}
	/>
	{/if}
</Page>
