<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BalancerAccountPoolBalance, {
		$account: {
			$network: data.selector.$network,
			$actor: {
				address: params.accountAddress,
			},
		},
		$pool: data.selector,
	}, {
		sources: [
			Source.Balancer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerAccountPoolBalanceView from '$/views/BalancerAccountPoolBalanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Balancer account pool balance'} • Balancer account pool balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer account pool balance'} • Balancer account pool balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BalancerAccountPoolBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
