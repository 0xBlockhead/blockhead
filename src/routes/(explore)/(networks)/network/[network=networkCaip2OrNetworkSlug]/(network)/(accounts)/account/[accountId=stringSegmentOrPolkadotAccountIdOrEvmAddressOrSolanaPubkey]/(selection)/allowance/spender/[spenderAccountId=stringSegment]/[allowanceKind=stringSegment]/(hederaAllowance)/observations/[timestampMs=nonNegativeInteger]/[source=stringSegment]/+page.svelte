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
	import HederaAllowance_TimestampView from '$/views/HederaAllowance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera allowance timestamp'} • hedera allowance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaAllowance_TimestampView
		selection={
			select(EntityType.HederaAllowance_Timestamp, {
				$allowance: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
