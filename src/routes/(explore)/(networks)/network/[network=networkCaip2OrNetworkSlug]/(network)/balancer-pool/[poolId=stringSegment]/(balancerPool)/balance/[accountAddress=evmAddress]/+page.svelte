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


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerAccountPoolBalanceView from '$/views/BalancerAccountPoolBalanceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Balancer account pool balance'} • Balancer account pool balance • Blockhead</title>
</svelte:head>


<Page>
	<BalancerAccountPoolBalanceView
		selection={
			select(EntityType.BalancerAccountPoolBalance, {
				$account: {
					$network: selector.$pool.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$pool: data.selector,
			}, {
				sources: [
					Source.Balancer_Rest,
				],
			})
		}
	/>
</Page>
