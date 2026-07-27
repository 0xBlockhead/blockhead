<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(
		(
			data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ?
				select(EntityType.PolkadotBlock, data.selector, {
					fields: {
						stateRoot: true,
						extrinsicsRoot: true,
						$parent: true,
					},
				})
			:
				select(EntityType.UtxoBlock, data.selector, {
					fields: {
						transactionCount: true,
						timestampMs: true,
						merkleRoot: true,
						nonce: true,
						difficulty: true,
						sizeBytes: true,
						weightUnits: true,
						$parent: true,
					},
				})
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ?
				((String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (data.selector.hash ?? '') || 'Polkadot block')
			:
				((String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (data.selector.hash ?? '') || 'UTXO block')
		)
	)
	const entityViewByType = {
		[EntityType.PolkadotBlock]: {
			Component: PolkadotBlockView,
			label: 'Polkadot block',
		},
		[EntityType.UtxoBlock]: {
			Component: UtxoBlockView,
			label: 'UTXO block',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
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
