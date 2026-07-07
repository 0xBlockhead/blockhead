<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<Page>
	<UtxoTransactionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]', {
				networkSlug: params.networkSlug,
				txId: params.txId,
			})
		}
		selection={
			select(EntityType.UtxoTransaction, {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			}, {
				fields: {
					feeSats: true,
					isCoinbase: true,
					version: true,
					lockTime: true,
					sizeBytes: true,
					virtualSizeBytes: true,
					weightUnits: true,
					$block: true,
				},
			})
		}
	/>
</Page>
