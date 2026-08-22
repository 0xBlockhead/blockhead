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


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaBlockView from '$/views/KaspaBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'kaspa block'} • kaspa block • Blockhead</title>
</svelte:head>


<Page>
	<KaspaBlockView
		selection={
			select(EntityType.KaspaBlock, data.selector, {
				sources: [
					Source.KaspaExplorer,
					Source.KaspaNode_Grpc,
					Source.KaspaNode_Rest,
					Source.KaspaNode_Wrpc,
				],
			})
		}
	/>
</Page>
