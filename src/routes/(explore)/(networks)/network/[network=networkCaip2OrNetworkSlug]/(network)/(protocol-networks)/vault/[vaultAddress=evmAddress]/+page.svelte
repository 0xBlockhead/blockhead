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
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid vault'} • hyperliquid vault • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidVaultView
		selection={select(EntityType.HyperliquidVault, data.selector)}
	/>
</Page>
