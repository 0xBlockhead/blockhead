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
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar transaction'} • stellar transaction • Blockhead</title>
</svelte:head>


<Page>
	<StellarTransactionView
		selection={select(EntityType.StellarTransaction, data.selector)}
	/>
</Page>
