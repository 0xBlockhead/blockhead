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

	const pageSelection = $derived(select(EntityType.OciManifest, data.selector, {
		sources: [
			Source.OciRegistry_Distribution,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OciManifestView from '$/views/OciManifestView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.repository || 'OCI manifest')} • OCI manifest • Blockhead</title>
</svelte:head>


<Page>
	<OciManifestView
		selection={pageSelection}
	/>
</Page>
