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


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDataChunkView from '$/views/ZeroGDataChunkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'zero g data chunk'} • zero g data chunk • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGDataChunkView
		selection={
			select(EntityType.ZeroGDataChunk, {
				$dataBlob: data.selector,
				chunkIndex: Number(params.chunkIndex),
			})
		}
	/>
</Page>
