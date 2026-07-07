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
	import UtxoInputView from '$/views/UtxoInputView.svelte'
</script>


<Page>
	<UtxoInputView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/input/[inputIndex=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				txId: params.txId,
				inputIndex: params.inputIndex,
			})
		}
		selection={
			select(EntityType.UtxoInput, {
				$transaction: {
					$network: {
						slug: params.networkSlug,
					},
					txId: decodeURIComponent(params.txId),
				},
				indexInTransaction: Number(params.inputIndex),
			}, {
				fields: {
					$spentOutput: true,
					coinbaseScript: true,
					scriptSigAsm: true,
					sequence: true,
					witness: true,
				},
			})
		}
	/>
</Page>
