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
	}: EntitySelectionViewProps<EntityType.ElementsNetwork> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Esplora_Rest,
		],
	}))
	const elementsNetwork = $derived(viewSelection({
		fields: {
			federationName: true,
		},
	}))
	const titleFallback = 'Elements network'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ElementsAssetsView from '$/views/ElementsAssetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsNetwork}>
			{#snippet children(entity)}
				{(entity.federationName ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$settlementNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={elementsNetwork}
			>
				{#snippet children(entity)}
					{@const federationName = entity.federationName}
					{#if federationName != null}
						<div>
							<dt>Federation</dt>
							<dd>
								{federationName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blockTimeSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockTimeSeconds = entity.blockTimeSeconds}
					{#if blockTimeSeconds != null}
						<div>
							<dt>Block time seconds</dt>
							<dd>
								<NumberValue
									value={blockTimeSeconds}
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
							confidentialTransactionsDefault: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const confidentialTransactionsDefault = entity.confidentialTransactionsDefault}
					{#if confidentialTransactionsDefault != null}
						<div>
							<dt>Confidential transactions by default</dt>
							<dd>
								{confidentialTransactionsDefault ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nativeAsset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null}
						<div>
							<dt>Native asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const assetsResource = selection.$$assets}
		<ResourceBoundary
			resource={assetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ElementsAssetsView
						selection={assetsResource}
						countResource={assetsResource.count}
						title='Assets'
						id='assets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
