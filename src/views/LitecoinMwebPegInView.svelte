<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LitecoinMwebPegIn> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegIn}
	entitySelector={selection.entitySelector}
	title={title ?? 'litecoin MWEB peg in'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LitecoinMwebTransactionView
			selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.pegInIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$transparentOutput}
		>
			{#snippet children(utxoOutput)}
				{#if utxoOutput != null}
					<span data-text="muted">
						<UtxoOutputView
							selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
							prefetched={utxoOutput}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>peg in index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.pegInIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transparentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						<div>
							<dt>transparent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							amountLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountLitoshis = entity.amountLitoshis}
					{#if amountLitoshis != null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue
									value={amountLitoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
