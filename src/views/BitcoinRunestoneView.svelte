<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BitcoinRunestone>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	}))
	const bitcoinRunestone = $derived(viewSelection({
		fields: {
			isCenotaph: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinRunestone}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.outputIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.outputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinRunestone}>
			{#snippet children(entity)}
				{String(entity.isCenotaph)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Output index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$output}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						<div>
							<dt>Output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Payload hex</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									payloadHex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.payloadHex}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cenotaph</dt>
				<dd>
					<ResourceBoundary
						resource={bitcoinRunestone}
					>
						{#snippet children(entity)}
							{entity.isCenotaph ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
