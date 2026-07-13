<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ElementsAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ElementsAsset>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const elementsAsset = $derived(selection({
		sources: [
			Source.Esplora_Rest,
		],
		fields: {
			name: true,
			ticker: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.ticker) ?? ''), String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || 'Elements asset')
	const viewDomId = $derived('elements-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsAsset}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? ''), String((pendingEntity.ticker) ?? ''), String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || 'Elements asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.ticker) ?? ''), String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsAsset}>
			{#snippet Pending()}
				{[String((pendingEntity.ticker) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? ''), String((pendingEntity.ticker) ?? ''), String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || 'Elements asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.ticker) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.ticker) ?? ''), String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsAsset}>
			{#snippet Pending()}
				{@const assetId0 = pendingEntity.assetId}
				{#if assetId0 !== undefined && assetId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((assetId0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const assetId0 = resolvedEntity.assetId}
				{#if assetId0 !== undefined && assetId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((assetId0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetId = pendingEntity.assetId}
							{#if assetId !== undefined && assetId !== null}
								<TruncatedValue value={String((assetId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetId = resolvedEntity.assetId}
							{#if assetId !== undefined && assetId !== null}
								<TruncatedValue value={String((assetId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ticker: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ticker = pendingEntity.ticker}
					{#if ticker !== undefined && ticker !== null}
						<div>
							<dt>Ticker</dt>
							<dd>
								{String((ticker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ticker = resolvedEntity.ticker}
					{#if ticker !== undefined && ticker !== null}
						<div>
							<dt>Ticker</dt>
							<dd>
								{String((ticker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							precision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const precision = pendingEntity.precision}
					{#if precision !== undefined && precision !== null}
						<div>
							<dt>Precision</dt>
							<dd>
								<NumberValue value={Number(precision)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const precision = resolvedEntity.precision}
					{#if precision !== undefined && precision !== null}
						<div>
							<dt>Precision</dt>
							<dd>
								<NumberValue value={Number(precision)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							entityDomain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const entityDomain = pendingEntity.entityDomain}
					{#if entityDomain !== undefined && entityDomain !== null}
						<div>
							<dt>Entity domain</dt>
							<dd>
								{String((entityDomain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const entityDomain = resolvedEntity.entityDomain}
					{#if entityDomain !== undefined && entityDomain !== null}
						<div>
							<dt>Entity domain</dt>
							<dd>
								{String((entityDomain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hasBlindedIssuances: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hasBlindedIssuances = pendingEntity.hasBlindedIssuances}
					{#if hasBlindedIssuances !== undefined && hasBlindedIssuances !== null}
						<div>
							<dt>Has blinded issuances</dt>
							<dd>
								{hasBlindedIssuances ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hasBlindedIssuances = resolvedEntity.hasBlindedIssuances}
					{#if hasBlindedIssuances !== undefined && hasBlindedIssuances !== null}
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
					selection({
						fields: {
							contractJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractJson = pendingEntity.contractJson}
					{#if contractJson !== undefined && contractJson !== null}
						<div>
							<dt>Contract JSON</dt>
							<dd>
								<span data-text="long-text">{String((contractJson) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractJson = resolvedEntity.contractJson}
					{#if contractJson !== undefined && contractJson !== null}
						<div>
							<dt>Contract JSON</dt>
							<dd>
								<span data-text="long-text">{String((contractJson) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ElementsAsset_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Esplora_Rest,
							],
							count: true,
						})
					}
				title='Observations'
				id='ElementsAsset_TimestampsView-timestamps'
			/>

			<ElementsIssuancesView
				selection={
						selection.$$issuances({
							count: true,
						})
					}
				title='Issuances'
				id='ElementsIssuancesView-issuances'
			/>
		{/if}
	{/snippet}
</EntityView>
