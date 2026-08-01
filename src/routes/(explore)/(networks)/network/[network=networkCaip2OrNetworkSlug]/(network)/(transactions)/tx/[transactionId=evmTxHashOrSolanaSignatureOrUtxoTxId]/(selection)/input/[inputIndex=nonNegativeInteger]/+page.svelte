<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const documentTitle = $derived(
		(
			data.entityType === EntityType.CardanoTxInput ?
				('Input ' + String(data.selector.inputIndex)) + ' • Cardano transaction input • Blockhead'
			:
				((String(data.selector.indexInTransaction ?? '') ? 'Input #' + String(data.selector.indexInTransaction ?? '') : '') || 'UTXO input') + ' • UTXO input • Blockhead'
		)
	)
	const entityViewByType = {
		[EntityType.CardanoTxInput]: CardanoTxInputView,
		[EntityType.UtxoInput]: UtxoInputView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxInputView from '$/views/CardanoTxInputView.svelte'
	import UtxoInputView from '$/views/UtxoInputView.svelte'
</script>


<svelte:head>
	<title>{documentTitle}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.CardanoTxInput ?
				select(EntityType.CardanoTxInput, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
					],
					fields: {
						inputKind: true,
						spentTxHash: true,
						spentOutputIndex: true,
						$spentOutput: true,
						redeemerIndex: true,
					},
				})
			:
				select(EntityType.UtxoInput, data.selector, {
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
