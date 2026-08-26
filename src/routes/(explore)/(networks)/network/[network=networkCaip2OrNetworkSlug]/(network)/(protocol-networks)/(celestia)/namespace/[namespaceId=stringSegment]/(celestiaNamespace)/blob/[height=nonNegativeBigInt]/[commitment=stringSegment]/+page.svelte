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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CelestiaBlob, {
		$namespace: data.selector,
		height: BigInt(params.height),
		commitment: params.commitment,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlobView from '$/views/CelestiaBlobView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.commitment || 'celestia blob')} • celestia blob • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'celestia blob'} • celestia blob • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CelestiaBlobView
		selection={pageSelection}
	/>
	{/if}
</Page>
