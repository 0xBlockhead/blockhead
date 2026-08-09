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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.DogecoinAuxPowMerkleBranch, {
		$auxPow: data.selector,
		branchKind: params.branchKind,
	}, {
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinAuxPowMerkleBranchView from '$/views/DogecoinAuxPowMerkleBranchView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.branchKind || 'dogecoin aux pow merkle branch')} • dogecoin aux pow merkle branch • Blockhead</title>
</svelte:head>


<Page>
	<DogecoinAuxPowMerkleBranchView
		selection={pageSelection}
	/>
</Page>
