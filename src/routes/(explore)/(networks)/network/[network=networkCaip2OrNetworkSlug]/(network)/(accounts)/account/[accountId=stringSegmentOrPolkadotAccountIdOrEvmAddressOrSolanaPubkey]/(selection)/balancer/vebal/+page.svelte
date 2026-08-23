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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerVeBalBalanceView from '$/views/BalancerVeBalBalanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BalancerVeBalBalance, {
				$account: data.selector,
			}, {
				sources: [
					Source.Balancer_Rest,
				],
				fields: {
					balance: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer veBAL balance' : pageSelection.entity.balance || 'Balancer veBAL balance')} • Balancer veBAL balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer veBAL balance'} • Balancer veBAL balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BalancerVeBalBalance, {
				$account: data.selector,
			}, {
				sources: [
					Source.Balancer_Rest,
				],
				fields: {
					balance: true,
				},
			})}

	<BalancerVeBalBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
