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
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'TON transaction'} • TON transaction • Blockhead</title>
</svelte:head>


<Page>
	<TonTransactionView
		selection={
			select(EntityType.TonTransaction, {
				$account: data.selector.$account,
				lt: BigInt(params.lt),
				hash: params.hash,
			})
		}
	/>
</Page>
