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

	const pageSelection = $derived(select(EntityType.BalancerVeBalBalance, {
		$account: data.selector,
	}, {
		sources: [
			Source.Balancer_Rest,
		],
		fields: {
			balance: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerVeBalBalanceView from '$/views/BalancerVeBalBalanceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer veBAL balance' : pageSelection.entity.balance || 'Balancer veBAL balance')} • Balancer veBAL balance • Blockhead</title>
</svelte:head>


<Page>
	<BalancerVeBalBalanceView
		selection={pageSelection}
	/>
</Page>
