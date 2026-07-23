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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSource, {
		id: params.sourceId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			source: true,
			provider: true,
			endpointUrl: true,
			transportKind: true,
			authKind: true,
			corsMode: true,
			proxyMode: true,
			environmentScope: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		id: params.sourceId,
	}.id) ?? '')].filter(Boolean).join(' ') || 'source' : [String((({ ...{
		id: params.sourceId,
	}, ...pageSelection.entity }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		id: params.sourceId,
	}, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'source')} • source • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSourceView
		href={
			resolve('/~/manage/source/[sourceId=stringSegment]', {
				sourceId: params.sourceId,
			})
		}
		selection={pageSelection}
	/>
</Page>
