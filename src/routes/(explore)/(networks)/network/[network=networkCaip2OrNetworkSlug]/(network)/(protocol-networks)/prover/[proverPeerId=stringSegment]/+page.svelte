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

	const pageSelection = $derived(select(EntityType.QuilibriumProver, data.selector, {
		sources: [
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumProverView from '$/views/QuilibriumProverView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.proverPeerId || 'quilibrium prover')} • quilibrium prover • Blockhead</title>
</svelte:head>


<Page>
	<QuilibriumProverView
		selection={pageSelection}
	/>
</Page>
