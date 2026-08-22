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
	import SuiBalanceChangeView from '$/views/SuiBalanceChangeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui balance change'} • Sui balance change • Blockhead</title>
</svelte:head>


<Page>
	<SuiBalanceChangeView
		selection={
			select(EntityType.SuiBalanceChange, {
				$transaction: data.selector,
				changeIndex: Number(params.changeIndex),
			})
		}
	/>
</Page>
