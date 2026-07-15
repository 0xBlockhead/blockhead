<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.PythPriceFeed_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.PythPriceFeed_Timestamp>>
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
	const pythPriceFeedTimestamp = $derived(selection({
		sources: [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
			Source.Pyth_EvmContract,
			Source.Pyth_SolanaProgram,
		],
		fields: {
			price: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.publishTimeMs) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed timestamp')
	const viewDomId = $derived('pyth-price-feed-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.PythPriceFeed_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={pythPriceFeedTimestamp}>
			{#snippet Pending()}
				{@const publishTimeMs0 = pendingEntity.publishTimeMs}
				{#if publishTimeMs0 !== undefined && publishTimeMs0 !== null}
					<Timestamp timestamp={Number(publishTimeMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publishTimeMs0 = resolvedEntity.publishTimeMs}
				{#if publishTimeMs0 !== undefined && publishTimeMs0 !== null}
					<Timestamp timestamp={Number(publishTimeMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={pythPriceFeedTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.price) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.publishTimeMs) ?? '')].filter(Boolean).join(' ') || title || 'Pyth price feed timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.price) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.publishTimeMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={pythPriceFeedTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<PythPriceFeedView
						selection={select(EntityType.PythPriceFeed, selection.entitySelector.$feed, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Publish time ms</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									publishTimeMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const publishTimeMs = pendingEntity.publishTimeMs}
							{#if publishTimeMs !== undefined && publishTimeMs !== null}
								<Timestamp timestamp={Number(publishTimeMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const publishTimeMs = resolvedEntity.publishTimeMs}
							{#if publishTimeMs !== undefined && publishTimeMs !== null}
								<Timestamp timestamp={Number(publishTimeMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedAtMs = pendingEntity.observedAtMs}
					{#if observedAtMs !== undefined && observedAtMs !== null}
						<div>
							<dt>Observed at ms</dt>
							<dd>
								<Timestamp timestamp={Number(observedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedAtMs = resolvedEntity.observedAtMs}
					{#if observedAtMs !== undefined && observedAtMs !== null}
						<div>
							<dt>Observed at ms</dt>
							<dd>
								<Timestamp timestamp={Number(observedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							price: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const price = pendingEntity.price}
					{#if price !== undefined && price !== null}
						<div>
							<dt>Price</dt>
							<dd>
								<NumberValue value={Number(price)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const price = resolvedEntity.price}
					{#if price !== undefined && price !== null}
						<div>
							<dt>Price</dt>
							<dd>
								<NumberValue value={Number(price)} />
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
							conf: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const conf = pendingEntity.conf}
					{#if conf !== undefined && conf !== null}
						<div>
							<dt>Conf</dt>
							<dd>
								<NumberValue value={Number(conf)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const conf = resolvedEntity.conf}
					{#if conf !== undefined && conf !== null}
						<div>
							<dt>Conf</dt>
							<dd>
								<NumberValue value={Number(conf)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expo = pendingEntity.expo}
					{#if expo !== undefined && expo !== null}
						<div>
							<dt>Expo</dt>
							<dd>
								<NumberValue value={Number(expo)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expo = resolvedEntity.expo}
					{#if expo !== undefined && expo !== null}
						<div>
							<dt>Expo</dt>
							<dd>
								<NumberValue value={Number(expo)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							emaPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const emaPrice = pendingEntity.emaPrice}
					{#if emaPrice !== undefined && emaPrice !== null}
						<div>
							<dt>EMA price</dt>
							<dd>
								<NumberValue value={Number(emaPrice)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const emaPrice = resolvedEntity.emaPrice}
					{#if emaPrice !== undefined && emaPrice !== null}
						<div>
							<dt>EMA price</dt>
							<dd>
								<NumberValue value={Number(emaPrice)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							emaConf: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const emaConf = pendingEntity.emaConf}
					{#if emaConf !== undefined && emaConf !== null}
						<div>
							<dt>EMA conf</dt>
							<dd>
								<NumberValue value={Number(emaConf)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const emaConf = resolvedEntity.emaConf}
					{#if emaConf !== undefined && emaConf !== null}
						<div>
							<dt>EMA conf</dt>
							<dd>
								<NumberValue value={Number(emaConf)} />
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
							vaa: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const vaa = pendingEntity.vaa}
					{#if vaa !== undefined && vaa !== null}
						<div>
							<dt>VAA</dt>
							<dd>
								{String((vaa) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const vaa = resolvedEntity.vaa}
					{#if vaa !== undefined && vaa !== null}
						<div>
							<dt>VAA</dt>
							<dd>
								{String((vaa) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updateDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updateDataHash = pendingEntity.updateDataHash}
					{#if updateDataHash !== undefined && updateDataHash !== null}
						<div>
							<dt>Update data hash</dt>
							<dd>
								<TruncatedValue value={String((updateDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updateDataHash = resolvedEntity.updateDataHash}
					{#if updateDataHash !== undefined && updateDataHash !== null}
						<div>
							<dt>Update data hash</dt>
							<dd>
								<TruncatedValue value={String((updateDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slot = pendingEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue value={Number(slot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue value={Number(slot)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequence = pendingEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								<NumberValue value={Number(sequence)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								<NumberValue value={Number(sequence)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							onChainNetwork: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const onChainNetwork = pendingEntity.onChainNetwork}
					{#if onChainNetwork !== undefined && onChainNetwork !== null}
						<div>
							<dt>On-chain network</dt>
							<dd>
								{String((onChainNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const onChainNetwork = resolvedEntity.onChainNetwork}
					{#if onChainNetwork !== undefined && onChainNetwork !== null}
						<div>
							<dt>On-chain network</dt>
							<dd>
								{String((onChainNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							onChainContract: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const onChainContract = pendingEntity.onChainContract}
					{#if onChainContract !== undefined && onChainContract !== null}
						<div>
							<dt>On-chain contract</dt>
							<dd>
								{String((onChainContract) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const onChainContract = resolvedEntity.onChainContract}
					{#if onChainContract !== undefined && onChainContract !== null}
						<div>
							<dt>On-chain contract</dt>
							<dd>
								{String((onChainContract) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stale: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stale = pendingEntity.stale}
					{#if stale !== undefined && stale !== null}
						<div>
							<dt>Stale</dt>
							<dd>
								{stale ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stale = resolvedEntity.stale}
					{#if stale !== undefined && stale !== null}
						<div>
							<dt>Stale</dt>
							<dd>
								{stale ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
