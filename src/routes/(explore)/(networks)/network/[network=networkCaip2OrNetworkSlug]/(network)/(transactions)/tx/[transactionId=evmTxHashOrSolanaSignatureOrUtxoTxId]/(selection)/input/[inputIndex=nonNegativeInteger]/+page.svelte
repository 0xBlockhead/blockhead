<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(
		(
			data.entityType === EntityType.CardanoTxInput && data.selectorName === 'TransactionInputIndex' ?
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
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.CardanoTxInput && data.selectorName === 'TransactionInputIndex' ?
				((String(data.selector.inputIndex) ? 'Input ' + String(data.selector.inputIndex) : '') || 'Cardano transaction input')
			:
				((String(data.selector.indexInTransaction ?? '') ? 'Input #' + String(data.selector.indexInTransaction ?? '') : '') || 'UTXO input')
		)
	)
	const entityViewByType = {
		[EntityType.CardanoTxInput]: {
			Component: CardanoTxInputView,
			label: 'Cardano transaction input',
		},
		[EntityType.UtxoInput]: {
			Component: UtxoInputView,
			label: 'UTXO input',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxInputView from '$/views/CardanoTxInputView.svelte'
	import UtxoInputView from '$/views/UtxoInputView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • {entityViewByType[data.entityType].label} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType].Component}

	<EntityView
		selection={pageSelection}
	/>
</Page>
