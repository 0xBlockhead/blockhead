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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.OciManifest, data.selector, {
		sources: [
			Source.OciRegistry_Distribution,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OciManifestView from '$/views/OciManifestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.repository || 'OCI manifest')} • OCI manifest • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'OCI manifest'} • OCI manifest • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<OciManifestView
		selection={pageSelection}
	/>
	{/if}
</Page>
