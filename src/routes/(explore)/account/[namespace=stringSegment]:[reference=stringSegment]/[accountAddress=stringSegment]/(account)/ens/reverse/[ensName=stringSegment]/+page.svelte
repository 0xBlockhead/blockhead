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
	import EnsReverseRecordView from '$/views/EnsReverseRecordView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ENS reverse record'} • ENS reverse record • Blockhead</title>
</svelte:head>


<Page>
	<EnsReverseRecordView
		selection={
			select(EntityType.EnsReverseRecord, data.selector, {
				sources: [
					Source.TheGraph_Graphql,
					Source.Voltaire_JsonRpc,
				],
			})
		}
	/>
</Page>
