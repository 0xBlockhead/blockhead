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

	const pageSelection = $derived(select(EntityType.QuilibriumShard, data.selector, {
		sources: [
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumShardView from '$/views/QuilibriumShardView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.shardKey || 'quilibrium shard')} • quilibrium shard • Blockhead</title>
</svelte:head>


<Page>
	<QuilibriumShardView
		selection={pageSelection}
	/>
</Page>
