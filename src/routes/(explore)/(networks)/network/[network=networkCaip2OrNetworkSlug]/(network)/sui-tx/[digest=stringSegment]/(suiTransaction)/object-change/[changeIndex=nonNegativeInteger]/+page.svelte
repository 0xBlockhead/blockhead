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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiObjectChange, {
		$transaction: data.selector,
		changeIndex: Number(params.changeIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiObjectChangeView from '$/views/SuiObjectChangeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui object change'} • Sui object change • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui object change'} • Sui object change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiObjectChangeView
		selection={pageSelection}
	/>
	{/if}
</Page>
