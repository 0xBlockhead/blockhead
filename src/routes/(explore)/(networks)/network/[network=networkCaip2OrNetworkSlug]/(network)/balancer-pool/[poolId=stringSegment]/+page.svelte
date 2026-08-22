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

	const pageSelection = $derived(select(EntityType.BalancerPool, data.selector, {
		sources: [
			Source.Balancer_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool' : pageSelection.entity.name || 'Balancer pool')} • Balancer pool • Blockhead</title>
</svelte:head>


<Page>
	<BalancerPoolView
		selection={pageSelection}
	/>
</Page>
