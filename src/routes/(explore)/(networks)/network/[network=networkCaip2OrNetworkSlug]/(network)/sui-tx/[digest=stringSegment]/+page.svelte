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
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui transaction'} • Sui transaction • Blockhead</title>
</svelte:head>


<Page>
	<SuiTransactionView
		selection={select(EntityType.SuiTransaction, data.selector)}
	/>
</Page>
