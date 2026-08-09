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

	const pageSelection = $derived(select(EntityType.CashuKeyset_Timestamp, {
		$keyset: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CashuKeyset_TimestampView from '$/views/CashuKeyset_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Cashu keyset timestamp')} • Cashu keyset timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CashuKeyset_TimestampView
		selection={pageSelection}
	/>
</Page>
