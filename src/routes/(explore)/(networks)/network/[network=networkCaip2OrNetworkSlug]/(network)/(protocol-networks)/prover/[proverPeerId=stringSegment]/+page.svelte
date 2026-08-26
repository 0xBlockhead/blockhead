<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.QuilibriumProver, data.selector, {
		sources: [
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumProverView from '$/views/QuilibriumProverView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.proverPeerId || 'quilibrium prover')} • quilibrium prover • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'quilibrium prover'} • quilibrium prover • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<QuilibriumProverView
		selection={pageSelection}
	/>
	{/if}
</Page>
