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

	const pageSelection = $derived(select(EntityType.NostrRelay_Timestamp, {
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$relay: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.source ?? '') || 'Nostr relay timestamp' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'Nostr relay timestamp')} • Nostr relay timestamp • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelay_TimestampView
		selection={pageSelection}
	/>
</Page>
