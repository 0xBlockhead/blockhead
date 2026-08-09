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
	import TezosBigMapDiffView from '$/views/TezosBigMapDiffView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos big map diff'} • tezos big map diff • Blockhead</title>
</svelte:head>


<Page>
	<TezosBigMapDiffView
		selection={
			select(EntityType.TezosBigMapDiff, {
				$operation: data.selector,
				bigMapId: BigInt(params.bigMapId),
				keyHash: params.keyHash,
			})
		}
	/>
</Page>
