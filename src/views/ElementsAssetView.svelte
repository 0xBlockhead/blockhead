<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.ElementsAsset> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Esplora_Rest,
		],
	}))
	const elementsAsset = $derived(viewSelection({
		fields: {
			name: true,
			ticker: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.ticker ?? ''), selection.entitySelector.assetId].filter(Boolean).join(' ') || 'Elements asset')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ElementsAsset_TimestampsView from '$/views/ElementsAsset_TimestampsView.svelte'
	import ElementsIssuancesView from '$/views/ElementsIssuancesView.svelte'
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsAsset}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.ticker ?? ''), selection.entitySelector.assetId].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsAsset}>
			{#snippet children(entity)}
				{(entity.ticker ?? '') || [(entity.name ?? ''), (entity.ticker ?? ''), selection.entitySelector.assetId].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<TruncatedValue value={selection.entitySelector.assetId} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.assetId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={elementsAsset}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={elementsAsset}
			>
				{#snippet children(entity)}
					{@const ticker = entity.ticker}
					{#if ticker != null}
						<div>
							<dt>Ticker</dt>
							<dd>
								{ticker}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							precision: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const precision = entity.precision}
					{#if precision != null}
						<div>
							<dt>Precision</dt>
							<dd>
								<NumberValue
									value={precision}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							entityDomain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const entityDomain = entity.entityDomain}
					{#if entityDomain != null}
						<div>
							<dt>Entity domain</dt>
							<dd>
								{entityDomain}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							hasBlindedIssuances: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hasBlindedIssuances = entity.hasBlindedIssuances}
					{#if hasBlindedIssuances != null}
						<div>
							<dt>Has blinded issuances</dt>
							<dd>
								{hasBlindedIssuances ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contractJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractJson = entity.contractJson}
					{#if contractJson != null}
						<div>
							<dt>Contract JSON</dt>
							<dd>
								<span data-text="long-text">{contractJson}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ElementsAsset_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const issuancesResource = selection.$$issuances}
		<ResourceBoundary
			resource={issuancesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ElementsIssuancesView
						selection={issuancesResource}
						countResource={issuancesResource.count}
						title='Issuances'
						id='issuances'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
