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


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinAuxPowMerkleBranchView from '$/views/DogecoinAuxPowMerkleBranchView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DogecoinAuxPowMerkleBranch, {
				$auxPow: data.selector,
				branchKind: params.branchKind,
			}, {
				sources: [
					Source.DogecoinCore_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.branchKind || 'dogecoin aux pow merkle branch')} • dogecoin aux pow merkle branch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dogecoin aux pow merkle branch'} • dogecoin aux pow merkle branch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.DogecoinAuxPowMerkleBranch, {
				$auxPow: data.selector,
				branchKind: params.branchKind,
			}, {
				sources: [
					Source.DogecoinCore_JsonRpc,
				],
			})}

	<DogecoinAuxPowMerkleBranchView
		selection={pageSelection}
	/>
	{/if}
</Page>
