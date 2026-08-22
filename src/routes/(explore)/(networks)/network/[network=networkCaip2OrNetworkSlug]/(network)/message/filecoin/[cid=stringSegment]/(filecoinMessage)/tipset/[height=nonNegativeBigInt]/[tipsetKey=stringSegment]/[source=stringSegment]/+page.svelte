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

	const pageSelection = $derived(select(EntityType.FilecoinMessage_Timestamp, {
		$message: data.selector,
		height: BigInt(params.height),
		tipsetKey: params.tipsetKey,
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			timestampMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessage_TimestampView from '$/views/FilecoinMessage_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin message timestamp')} • filecoin message timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessage_TimestampView
		selection={pageSelection}
	/>
</Page>
