<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.EnsRecord, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			recordKind: true,
			coinType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entitySelector.recordKey || 'ENS record'))} • ENS record • Blockhead</title>
</svelte:head>


<Page>
	<EnsRecordView
		selection={pageSelection}
	/>
</Page>
