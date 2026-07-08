<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>>
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
	const ethereumBeaconFinalityTimestamp = $derived(selection({
		fields: {
			finalizedCheckpointEpoch: true,
		},
	}))
	const titleFallback = $derived([(String((prefetched.finalizedCheckpointEpoch) ?? '') ? 'Finalized epoch ' + String((prefetched.finalizedCheckpointEpoch) ?? '') : '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp')
	const viewDomId = $derived('ethereum-beacon-finality-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.timestampMs !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality/[timestampMs=nonNegativeInteger]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			timestampMs: String(pendingEntity.timestampMs ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const finalizedCheckpointEpoch0 = prefetched.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<span>Finalized epoch </span>
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<span>Finalized epoch </span>
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const finalizedCheckpointEpoch0 = prefetched.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
				<dt>Finalized checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									finalizedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const finalizedCheckpointEpoch = prefetched.finalizedCheckpointEpoch}
							{#if finalizedCheckpointEpoch !== undefined && finalizedCheckpointEpoch !== null}
								<NumberValue value={Number(finalizedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const finalizedCheckpointEpoch = resolvedEntity.finalizedCheckpointEpoch}
							{#if finalizedCheckpointEpoch !== undefined && finalizedCheckpointEpoch !== null}
								<NumberValue value={Number(finalizedCheckpointEpoch)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									finalizedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const finalizedCheckpointRoot = prefetched.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String((finalizedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const finalizedCheckpointRoot = resolvedEntity.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String((finalizedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Current justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currentJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointEpoch = prefetched.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(currentJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currentJustifiedCheckpointEpoch = resolvedEntity.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(currentJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Current justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currentJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointRoot = prefetched.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((currentJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currentJustifiedCheckpointRoot = resolvedEntity.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((currentJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									previousJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointEpoch = prefetched.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(previousJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const previousJustifiedCheckpointEpoch = resolvedEntity.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(previousJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									previousJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointRoot = prefetched.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((previousJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const previousJustifiedCheckpointRoot = resolvedEntity.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((previousJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
		</dl>
	{/snippet}
</EntityView>
