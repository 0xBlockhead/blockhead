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
	import ZeroGStorageNode_TimestampView from '$/views/ZeroGStorageNode_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'zero g storage node timestamp'} • zero g storage node timestamp • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGStorageNode_TimestampView
		selection={
			select(EntityType.ZeroGStorageNode_Timestamp, {
				$storageNode: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
