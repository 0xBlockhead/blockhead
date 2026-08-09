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
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui coin type'} • Sui coin type • Blockhead</title>
</svelte:head>


<Page>
	<SuiCoinTypeView
		selection={select(EntityType.SuiCoinType, data.selector)}
	/>
</Page>
