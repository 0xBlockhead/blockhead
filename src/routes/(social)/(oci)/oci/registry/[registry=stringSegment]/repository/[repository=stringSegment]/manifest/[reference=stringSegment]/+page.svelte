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
	import OciManifestView from '$/views/OciManifestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OciManifest, data.selector, {
					sources: [
						Source.OciRegistry_Distribution,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.repository || 'OCI manifest')} • OCI manifest • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'OCI manifest'} • OCI manifest • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OciManifest, data.selector, {
					sources: [
						Source.OciRegistry_Distribution,
					],
				}))}

		<OciManifestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
