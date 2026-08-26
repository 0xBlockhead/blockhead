<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplAmm, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmmView from '$/views/XrplAmmView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL AMM'} • XRPL AMM • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL AMM'} • XRPL AMM • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplAmmView
		selection={pageSelection}
	/>
	{/if}
</Page>
