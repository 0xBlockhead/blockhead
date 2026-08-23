<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.DogecoinBlockAuxPow, data.selector, {
					sources: [
						Source.DogecoinCore_JsonRpc,
					],
				}))}
			<title>{data?.title ?? 'dogecoin block aux pow'} • dogecoin block aux pow • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'dogecoin block aux pow'} • dogecoin block aux pow • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.DogecoinBlockAuxPow, data.selector, {
					sources: [
						Source.DogecoinCore_JsonRpc,
					],
				}))}

		<DogecoinBlockAuxPowView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
