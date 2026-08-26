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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadiclePatch, {
		$repository: data.selector,
		patchId: params.patchId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RadiclePatchView from '$/views/RadiclePatchView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle patch'} • radicle patch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle patch'} • radicle patch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadiclePatchView
		selection={pageSelection}
	/>
	{/if}
</Page>
