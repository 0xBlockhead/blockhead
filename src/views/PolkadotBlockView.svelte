<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.PolkadotBlock>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.PolkadotBlock>
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
	const polkadotBlock = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived((String((pendingEntity.blockNumber) ?? '') ? 'Block #' + String((pendingEntity.blockNumber) ?? '') : '') || [String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block')
	const viewDomId = $derived('polkadot-block-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotExtrinsicsView from '$/views/PolkadotExtrinsicsView.svelte'
	import PolkadotEventsView from '$/views/PolkadotEventsView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.blockNumber ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'blockNumber' in selection.entitySelector
			&& selection.entitySelector.blockNumber != null ?
				selection.entitySelector != null && '$network' in selection.entitySelector
				&& selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
				blockNumber: String(selection.entitySelector.blockNumber ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector != null && '$network' in selection.entitySelector
					&& selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
					blockNumber: String(selection.entitySelector.blockNumber ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
						selection.entitySelector != null && 'hash' in selection.entitySelector
						&& selection.entitySelector.hash != null
						&& selection.entitySelector != null && '$network' in selection.entitySelector
						&& selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
						&& selection.entitySelector.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
						blockNumber: String(selection.entitySelector.blockNumber ?? ''),
						hash: String(selection.entitySelector.hash ?? ''),
						network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
					})
					:
							selection.entitySelector != null && 'hash' in selection.entitySelector
							&& selection.entitySelector.hash != null
							&& selection.entitySelector != null && '$network' in selection.entitySelector
							&& selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
							&& selection.entitySelector.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(selection.entitySelector.blockNumber ?? ''),
							hash: String(selection.entitySelector.hash ?? ''),
							network: String(selection.entitySelector.$network.slug ?? ''),
						})
						:
							undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'hash')}
			{@const hash0 = pendingEntity.hash}
			{#if hash0 !== undefined && hash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((hash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash0 = resolvedEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((hash0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							stateRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateRoot = resolvedEntity.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={String((stateRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicsRoot = resolvedEntity.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={String((extrinsicsRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(polkadotBlock)}
					{#if polkadotBlock != null && polkadotBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<PolkadotBlockView
									selection={select(EntityType.PolkadotBlock, polkadotBlock[EntityMetaKey.Selector])}
									prefetched={polkadotBlock}
									href={
										(
											polkadotBlock[EntityMetaKey.Selector] != null && 'blockNumber' in polkadotBlock[EntityMetaKey.Selector]
											&& polkadotBlock[EntityMetaKey.Selector].blockNumber != null ?
												polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
												&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotBlock[EntityMetaKey.Selector].$network
												&& polkadotBlock[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
												network: String(caip2StringFromValue(polkadotBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
													&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'slug' in polkadotBlock[EntityMetaKey.Selector].$network
													&& polkadotBlock[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
													blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
													network: String(polkadotBlock[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
														polkadotBlock[EntityMetaKey.Selector] != null && 'hash' in polkadotBlock[EntityMetaKey.Selector]
														&& polkadotBlock[EntityMetaKey.Selector].hash != null
														&& polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
														&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotBlock[EntityMetaKey.Selector].$network
														&& polkadotBlock[EntityMetaKey.Selector].$network.caip2 != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
														blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
														hash: String(polkadotBlock[EntityMetaKey.Selector].hash ?? ''),
														network: String(caip2StringFromValue(polkadotBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
													})
													:
															polkadotBlock[EntityMetaKey.Selector] != null && 'hash' in polkadotBlock[EntityMetaKey.Selector]
															&& polkadotBlock[EntityMetaKey.Selector].hash != null
															&& polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
															&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'slug' in polkadotBlock[EntityMetaKey.Selector].$network
															&& polkadotBlock[EntityMetaKey.Selector].$network.slug != null ?
																resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
															blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
															hash: String(polkadotBlock[EntityMetaKey.Selector].hash ?? ''),
															network: String(polkadotBlock[EntityMetaKey.Selector].$network.slug ?? ''),
														})
														:
															undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const polkadotBlockPolkadotExtrinsicsViewExtrinsicsResource = selection
		.$$extrinsics({
			sources: [
				Source.Polkadot_JsonRpc,
				Source.SubstrateSidecar_Rest,
			],
		})}
				<ResourceBoundary
					resource={polkadotBlockPolkadotExtrinsicsViewExtrinsicsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<PolkadotExtrinsicsView
							selection={polkadotBlockPolkadotExtrinsicsViewExtrinsicsResource}
							countResource={polkadotBlockPolkadotExtrinsicsViewExtrinsicsResource.count}
							title='Extrinsics'
							id='PolkadotExtrinsicsView-extrinsics'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const polkadotBlockPolkadotEventsViewEventsResource = selection
		.$$events({
			sources: [
				Source.SubstrateSidecar_Rest,
			],
		})}
				<ResourceBoundary
					resource={polkadotBlockPolkadotEventsViewEventsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<PolkadotEventsView
							selection={polkadotBlockPolkadotEventsViewEventsResource}
							countResource={polkadotBlockPolkadotEventsViewEventsResource.count}
							title='Events'
							id='PolkadotEventsView-events'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
