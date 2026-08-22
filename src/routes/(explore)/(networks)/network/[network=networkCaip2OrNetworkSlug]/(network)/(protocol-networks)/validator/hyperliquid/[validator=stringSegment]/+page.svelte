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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidValidatorView from '$/views/HyperliquidValidatorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hyperliquid validator'} • hyperliquid validator • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidValidatorView
		selection={select(EntityType.HyperliquidValidator, data.selector)}
	/>
</Page>
