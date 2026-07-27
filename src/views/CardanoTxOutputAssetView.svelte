<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CardanoTxOutputAsset> = $props()

	const cardanoTxOutputAsset = $derived(selection({
		fields: {
			quantity: true,
		},
	}))
	const titleFallback = 'Cardano transaction output asset'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxOutputAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<CardanoNativeAssetView
			selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoTxOutputAsset}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.quantity}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>output</dt>
				<dd>
					<CardanoTxOutputView
						selection={select(EntityType.CardanoTxOutput, selection.entitySelector.$output)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>asset</dt>
				<dd>
					<CardanoNativeAssetView
						selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>quantity</dt>
				<dd>
					<ResourceBoundary
						resource={cardanoTxOutputAsset}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.quantity}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
