<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoTxOutputAsset>, 'prefetched'> = $props()

	const output = $derived(selection.entitySelector.$output)
	const asset = $derived(selection.entitySelector.$asset)
	const cardanoTxOutputAsset = $derived(selection({
		fields: {
			quantity: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxOutputAsset}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano transaction output asset'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/asset/[policyId=stringSegment]/[assetName=stringSegment]',
				{
					network: (
						'caip2' in output.$transaction.$network ?
							caip2StringFromValue(output.$transaction.$network.caip2)
						:
							output.$transaction.$network.slug
					),
					transactionId: output.$transaction.hash,
					outputIndex: String(output.outputIndex),
					policyId: asset.policyId,
					assetName: asset.assetName,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<CardanoNativeAssetView
			selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
			href={null}
			layout={EntityLayout.Title}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>output</dt>
				<dd>
					<CardanoTxOutputView
						selection={select(EntityType.CardanoTxOutput, selection.entitySelector.$output)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>asset</dt>
				<dd>
					<CardanoNativeAssetView
						selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
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
