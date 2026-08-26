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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.DogecoinBlockAuxPow, data.selector, {
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'dogecoin block aux pow'} • dogecoin block aux pow • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dogecoin block aux pow'} • dogecoin block aux pow • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<DogecoinBlockAuxPowView
		selection={pageSelection}
	/>
	{/if}
</Page>
