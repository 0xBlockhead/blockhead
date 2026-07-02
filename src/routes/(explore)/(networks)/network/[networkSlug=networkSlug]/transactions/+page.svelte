<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<UtxoTransactionsView
		selection={select(EntityType.UtxoNetwork, {
			$network: { slug: params.networkSlug },
		})[EntityProxyField]<EntityType.UtxoTransaction>('$$transactions')({ limit: 16 })}
		href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions', {
			networkSlug: params.networkSlug,
		})}
		id='transactions'
	/>
</Page>
