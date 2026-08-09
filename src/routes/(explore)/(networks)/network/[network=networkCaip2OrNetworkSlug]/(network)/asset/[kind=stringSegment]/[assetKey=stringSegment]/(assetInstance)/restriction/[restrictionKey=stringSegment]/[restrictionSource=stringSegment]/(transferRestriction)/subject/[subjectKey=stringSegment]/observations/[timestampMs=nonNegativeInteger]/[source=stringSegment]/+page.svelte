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


	// Components
	import Page from '$/components/Page.svelte'
	import TransferRestrictionCheck_TimestampView from '$/views/TransferRestrictionCheck_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'transfer restriction check timestamp'} • transfer restriction check timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TransferRestrictionCheck_TimestampView
		selection={
			select(EntityType.TransferRestrictionCheck_Timestamp, {
				$restriction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
				subjectKey: params.subjectKey,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
