<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoActor_Timestamp, {
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			displayName: true,
			handle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'AT Protocol account observation' : [(pageSelection.entity.displayName ?? ''), pageSelection.entity.handle].filter(Boolean).join(' ') || String(pageSelection.entitySelector.timestampMs) || 'AT Protocol account observation'} • AT Protocol account observation • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActor_TimestampView
		selection={pageSelection}
	/>
</Page>
