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
	import HederaContractLogView from '$/views/HederaContractLogView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera contract log'} • hedera contract log • Blockhead</title>
</svelte:head>


<Page>
	<HederaContractLogView
		selection={
			select(EntityType.HederaContractLog, {
				$contract: data.selector,
				consensusTimestamp: params.consensusTimestamp,
				logIndex: Number(params.logIndex),
			})
		}
	/>
</Page>
