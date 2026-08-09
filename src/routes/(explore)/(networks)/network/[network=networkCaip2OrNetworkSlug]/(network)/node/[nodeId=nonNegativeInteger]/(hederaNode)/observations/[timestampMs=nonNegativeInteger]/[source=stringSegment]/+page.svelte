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
	import HederaNode_TimestampView from '$/views/HederaNode_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera node timestamp'} • hedera node timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaNode_TimestampView
		selection={
			select(EntityType.HederaNode_Timestamp, {
				$node: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
