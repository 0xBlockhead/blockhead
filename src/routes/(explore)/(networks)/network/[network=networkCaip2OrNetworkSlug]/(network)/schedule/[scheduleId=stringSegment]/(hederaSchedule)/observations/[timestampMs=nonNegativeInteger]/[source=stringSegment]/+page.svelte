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
	import HederaSchedule_TimestampView from '$/views/HederaSchedule_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera schedule timestamp'} • hedera schedule timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaSchedule_TimestampView
		selection={
			select(EntityType.HederaSchedule_Timestamp, {
				$schedule: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
