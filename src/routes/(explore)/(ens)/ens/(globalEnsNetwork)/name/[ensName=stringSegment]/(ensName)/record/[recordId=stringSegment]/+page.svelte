<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
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
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record' : [String((({ ...data.selector, ...pageSelection.entity }).recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record'))} • ENS record • Blockhead</title>
</svelte:head>


<Page>
	<EnsRecordView
		href={
			resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]', {
				ensName: params.ensName,
				recordId: params.recordId,
			})
		}
		selection={pageSelection}
	/>
</Page>
