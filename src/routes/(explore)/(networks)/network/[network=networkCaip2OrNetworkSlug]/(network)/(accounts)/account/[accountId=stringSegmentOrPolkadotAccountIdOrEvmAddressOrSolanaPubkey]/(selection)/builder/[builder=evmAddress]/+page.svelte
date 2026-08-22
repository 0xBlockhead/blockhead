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
	import HyperliquidBuilderApprovalView from '$/views/HyperliquidBuilderApprovalView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hyperliquid builder approval'} • hyperliquid builder approval • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidBuilderApprovalView
		selection={
			select(EntityType.HyperliquidBuilderApproval, {
				$account: data.selector,
				builder: params.builder,
			})
		}
	/>
</Page>
