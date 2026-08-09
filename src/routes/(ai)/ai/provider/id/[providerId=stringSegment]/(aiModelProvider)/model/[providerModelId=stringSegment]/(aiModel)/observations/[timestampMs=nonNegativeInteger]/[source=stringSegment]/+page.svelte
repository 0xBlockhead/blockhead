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

	const pageSelection = $derived(select(EntityType.AiModel_Timestamp, {
		$model: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			providerDisplayName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModel_TimestampView from '$/views/AiModel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'AI model timestamp' : (pageSelection.entity.providerDisplayName ?? '') || 'AI model timestamp')} • AI model timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AiModel_TimestampView
		selection={pageSelection}
	/>
</Page>
