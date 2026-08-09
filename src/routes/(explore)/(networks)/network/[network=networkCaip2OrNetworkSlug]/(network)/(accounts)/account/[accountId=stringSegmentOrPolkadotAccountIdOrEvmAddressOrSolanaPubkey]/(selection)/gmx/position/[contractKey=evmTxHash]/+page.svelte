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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GmxPosition, {
		$account: data.selector,
		contractKey: params.contractKey,
	}, {
		sources: [
			Source.Gmx_Rest,
		],
		fields: {
			indexName: true,
			poolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GmxPositionView from '$/views/GmxPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'GMX position' : [(pageSelection.entity.indexName ?? ''), (pageSelection.entity.poolName ?? '')].filter(Boolean).join(' ') || 'GMX position')} • GMX position • Blockhead</title>
</svelte:head>


<Page>
	<GmxPositionView
		selection={pageSelection}
	/>
</Page>
