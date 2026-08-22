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
	import AlgorandTransactionGroupView from '$/views/AlgorandTransactionGroupView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand transaction group'} • algorand transaction group • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandTransactionGroupView
		selection={
			select(EntityType.AlgorandTransactionGroup, {
				$network: data.selector,
				group: params.group,
			})
		}
	/>
</Page>
