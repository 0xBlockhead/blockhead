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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.DogecoinAuxPowParentBlockHeader, {
		$auxPow: data.selector,
	}, {
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinAuxPowParentBlockHeaderView from '$/views/DogecoinAuxPowParentBlockHeaderView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'dogecoin aux pow parent block header'} • dogecoin aux pow parent block header • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dogecoin aux pow parent block header'} • dogecoin aux pow parent block header • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<DogecoinAuxPowParentBlockHeaderView
		selection={pageSelection}
	/>
	{/if}
</Page>
