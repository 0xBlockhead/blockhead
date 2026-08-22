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

	const pageSelection = $derived(select(EntityType.NearChunk, data.selector, {
		sources: [
			Source.NearRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearChunkView from '$/views/NearChunkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.chunkHash || 'near chunk')} • near chunk • Blockhead</title>
</svelte:head>


<Page>
	<NearChunkView
		selection={pageSelection}
	/>
</Page>
