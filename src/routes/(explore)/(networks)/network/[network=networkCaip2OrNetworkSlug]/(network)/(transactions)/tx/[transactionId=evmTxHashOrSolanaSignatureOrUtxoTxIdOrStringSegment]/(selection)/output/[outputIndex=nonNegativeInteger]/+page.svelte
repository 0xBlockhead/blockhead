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

	const entityViewByType = {
		[EntityType.CardanoTxOutput]: CardanoTxOutputView,
		[EntityType.UtxoOutput]: UtxoOutputView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.CardanoTxOutput ?
				(String(data.selector.outputIndex) || 'Cardano transaction output') + ' • Cardano transaction output • Blockhead'
			:
				((String(data.selector.indexInTransaction ?? '') ? 'Output #' + String(data.selector.indexInTransaction ?? '') : '') || 'UTXO output') + ' • UTXO output • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.CardanoTxOutput ?
				select(EntityType.CardanoTxOutput, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
						Source.CardanoKoios_Rest,
					],
				})
			:
				select(EntityType.UtxoOutput, data.selector)
		}
	/>
</Page>
