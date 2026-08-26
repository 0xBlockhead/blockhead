<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ElementsNetwork>, 'prefetched'> = $props()

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
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsNetwork}>
			{#snippet children(entity)}
				{(entity.federationName ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$settlementNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
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
						{@const elementsAssetInitial = untrack(() => elementsAsset)}
						<div>
							<dt>Native asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, (elementsAsset ?? elementsAssetInitial)[EntityMetaKey.Selector])}
									prefetched={elementsAsset ?? elementsAssetInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
