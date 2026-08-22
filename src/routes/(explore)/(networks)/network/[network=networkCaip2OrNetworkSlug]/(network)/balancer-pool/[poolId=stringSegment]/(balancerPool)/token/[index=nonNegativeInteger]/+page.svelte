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

	const pageSelection = $derived(select(EntityType.BalancerPoolToken, {
		$pool: data.selector,
		tokenIndex: Number(params.index),
	}, {
		sources: [
			Source.Balancer_Rest,
		],
		fields: {
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolTokenView from '$/views/BalancerPoolTokenView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool reserve token' : pageSelection.entity.symbol || 'Balancer pool reserve token')} • Balancer pool reserve token • Blockhead</title>
</svelte:head>


<Page>
	<BalancerPoolTokenView
		selection={pageSelection}
	/>
</Page>
