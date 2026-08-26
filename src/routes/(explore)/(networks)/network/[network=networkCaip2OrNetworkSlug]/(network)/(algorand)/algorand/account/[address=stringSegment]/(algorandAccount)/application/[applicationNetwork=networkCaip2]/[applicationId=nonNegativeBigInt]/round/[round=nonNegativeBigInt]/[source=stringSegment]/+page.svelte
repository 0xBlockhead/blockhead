<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandApplicationLocalState_Round, {
		$account: data.selector,
		$application: {
			$network: {
				$network: {
					caip2: params.applicationNetwork,
				},
			},
			applicationId: BigInt(params.applicationId),
		},
		round: BigInt(params.round),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandApplicationLocalState_RoundView from '$/views/AlgorandApplicationLocalState_RoundView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand application local state round'} • algorand application local state round • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand application local state round'} • algorand application local state round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandApplicationLocalState_RoundView
		selection={pageSelection}
	/>
	{/if}
</Page>
