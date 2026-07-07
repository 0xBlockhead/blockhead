<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinNetwork_Timestamp>>
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
	const filecoinNetworkTimestamp = $derived(selection({
		sources: [
			Source.Lotus_JsonRpc,
		],
		fields: {
			headHeight: true,
			headTipsetKey: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin network timestamp')
	const viewDomId = $derived('filecoin-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinMinersView from '$/views/FilecoinMinersView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinNetworkTimestamp}>
			{#snippet Pending()}
				{@const headHeight0 = prefetched.headHeight}
				{#if headHeight0 !== undefined && headHeight0 !== null}
					<NumberValue value={Number(headHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const headHeight0 = resolvedEntity.headHeight}
				{#if headHeight0 !== undefined && headHeight0 !== null}
					<NumberValue value={Number(headHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinNetworkTimestamp}>
			{#snippet Pending()}
				{@const headTipsetKey0 = prefetched.headTipsetKey}
				{#if headTipsetKey0 !== undefined && headTipsetKey0 !== null}
					<span data-text="muted">
						{String((headTipsetKey0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const headTipsetKey0 = resolvedEntity.headTipsetKey}
				{#if headTipsetKey0 !== undefined && headTipsetKey0 !== null}
					<span data-text="muted">
						{String((headTipsetKey0) ?? '')}
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							headHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headHeight = prefetched.headHeight}
					{#if headHeight !== undefined && headHeight !== null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue value={Number(headHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headHeight = resolvedEntity.headHeight}
					{#if headHeight !== undefined && headHeight !== null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue value={Number(headHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							headTipsetKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headTipsetKey = prefetched.headTipsetKey}
					{#if headTipsetKey !== undefined && headTipsetKey !== null}
						<div>
							<dt>Head tipset key</dt>
							<dd>
								{String((headTipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headTipsetKey = resolvedEntity.headTipsetKey}
					{#if headTipsetKey !== undefined && headTipsetKey !== null}
						<div>
							<dt>Head tipset key</dt>
							<dd>
								{String((headTipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							headBlockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headBlockCount = prefetched.headBlockCount}
					{#if headBlockCount !== undefined && headBlockCount !== null}
						<div>
							<dt>Head block count</dt>
							<dd>
								<NumberValue value={Number(headBlockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headBlockCount = resolvedEntity.headBlockCount}
					{#if headBlockCount !== undefined && headBlockCount !== null}
						<div>
							<dt>Head block count</dt>
							<dd>
								<NumberValue value={Number(headBlockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							headTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const headTimestampMs = prefetched.headTimestampMs}
					{#if headTimestampMs !== undefined && headTimestampMs !== null}
						<div>
							<dt>Head timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(headTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headTimestampMs = resolvedEntity.headTimestampMs}
					{#if headTimestampMs !== undefined && headTimestampMs !== null}
						<div>
							<dt>Head timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(headTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.FilecoinTipset, false>('$headTipset', {
						sources: [
							Source.Lotus_JsonRpc,
						],
					})
				}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Head tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
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
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							networkVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkVersion = prefetched.networkVersion}
					{#if networkVersion !== undefined && networkVersion !== null}
						<div>
							<dt>Network version</dt>
							<dd>
								<NumberValue value={Number(networkVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkVersion = resolvedEntity.networkVersion}
					{#if networkVersion !== undefined && networkVersion !== null}
						<div>
							<dt>Network version</dt>
							<dd>
								<NumberValue value={Number(networkVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							lotusVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lotusVersion = prefetched.lotusVersion}
					{#if lotusVersion !== undefined && lotusVersion !== null}
						<div>
							<dt>Lotus version</dt>
							<dd>
								{String((lotusVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lotusVersion = resolvedEntity.lotusVersion}
					{#if lotusVersion !== undefined && lotusVersion !== null}
						<div>
							<dt>Lotus version</dt>
							<dd>
								{String((lotusVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							lotusAgent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lotusAgent = prefetched.lotusAgent}
					{#if lotusAgent !== undefined && lotusAgent !== null}
						<div>
							<dt>Lotus agent</dt>
							<dd>
								{String((lotusAgent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lotusAgent = resolvedEntity.lotusAgent}
					{#if lotusAgent !== undefined && lotusAgent !== null}
						<div>
							<dt>Lotus agent</dt>
							<dd>
								{String((lotusAgent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							blockDelaySeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockDelaySeconds = prefetched.blockDelaySeconds}
					{#if blockDelaySeconds !== undefined && blockDelaySeconds !== null}
						<div>
							<dt>Block delay seconds</dt>
							<dd>
								<NumberValue value={Number(blockDelaySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockDelaySeconds = resolvedEntity.blockDelaySeconds}
					{#if blockDelaySeconds !== undefined && blockDelaySeconds !== null}
						<div>
							<dt>Block delay seconds</dt>
							<dd>
								<NumberValue value={Number(blockDelaySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							totalRawBytePower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalRawBytePower = prefetched.totalRawBytePower}
					{#if totalRawBytePower !== undefined && totalRawBytePower !== null}
						<div>
							<dt>Total raw byte power</dt>
							<dd>
								<NumberValue value={Number(totalRawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalRawBytePower = resolvedEntity.totalRawBytePower}
					{#if totalRawBytePower !== undefined && totalRawBytePower !== null}
						<div>
							<dt>Total raw byte power</dt>
							<dd>
								<NumberValue value={Number(totalRawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							totalQualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalQualityAdjustedPower = prefetched.totalQualityAdjustedPower}
					{#if totalQualityAdjustedPower !== undefined && totalQualityAdjustedPower !== null}
						<div>
							<dt>Total quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(totalQualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalQualityAdjustedPower = resolvedEntity.totalQualityAdjustedPower}
					{#if totalQualityAdjustedPower !== undefined && totalQualityAdjustedPower !== null}
						<div>
							<dt>Total quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(totalQualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<FilecoinMinersView
				selection={
						selection[EntityProxyField]<EntityType.FilecoinMiner>('$$headMiners', {
							sources: [
								Source.Lotus_JsonRpc,
							],
						})
					}
				title='Head miners'
				id='FilecoinMinersView-$$headMiners'
			/>
		{/if}
	{/snippet}
</EntityView>
