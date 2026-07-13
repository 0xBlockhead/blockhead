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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMiner>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinMiner>>
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
	const filecoinMiner = $derived(selection({
		sources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
		fields: {
			qualityAdjustedPower: true,
			peerId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || 'filecoin miner')
	const viewDomId = $derived('filecoin-miner-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinSectorsView from '$/views/FilecoinSectorsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMiner}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinMiner}>
			{#snippet Pending()}
				{[String((pendingEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || title || 'filecoin miner'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinMiner}>
			{#snippet Pending()}
				{@const qualityAdjustedPower0 = pendingEntity.qualityAdjustedPower}
				{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
					<NumberValue value={Number(qualityAdjustedPower0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const qualityAdjustedPower0 = resolvedEntity.qualityAdjustedPower}
				{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
					<NumberValue value={Number(qualityAdjustedPower0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMiner}>
			{#snippet Pending()}
				{@const peerId0 = pendingEntity.peerId}
				{#if peerId0 !== undefined && peerId0 !== null}
					<span data-text="muted">
						{String((peerId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const peerId0 = resolvedEntity.peerId}
				{#if peerId0 !== undefined && peerId0 !== null}
					<span data-text="muted">
						{String((peerId0) ?? '')}
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
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Miner address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									minerAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const minerAddress = pendingEntity.minerAddress}
							{#if minerAddress !== undefined && minerAddress !== null}
								<TruncatedValue value={String((minerAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const minerAddress = resolvedEntity.minerAddress}
							{#if minerAddress !== undefined && minerAddress !== null}
								<TruncatedValue value={String((minerAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection.$owner({
						sources: [
							Source.Lotus_JsonRpc,
							Source.Filfox_Rest,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection.$worker({
						sources: [
							Source.Lotus_JsonRpc,
							Source.Filfox_Rest,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Worker</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							Source.Filfox_Rest,
						],
						fields: {
							peerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerId = pendingEntity.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerId = resolvedEntity.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
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
							Source.Filfox_Rest,
						],
						fields: {
							qualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const qualityAdjustedPower = pendingEntity.qualityAdjustedPower}
					{#if qualityAdjustedPower !== undefined && qualityAdjustedPower !== null}
						<div>
							<dt>Quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(qualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const qualityAdjustedPower = resolvedEntity.qualityAdjustedPower}
					{#if qualityAdjustedPower !== undefined && qualityAdjustedPower !== null}
						<div>
							<dt>Quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(qualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<FilecoinSectorsView
				selection={
						selection.$$sectors({
							sources: [
								Source.Lotus_JsonRpc,
							],
							count: true,
						})
					}
				title='Sectors'
				id='FilecoinSectorsView-sectors'
			/>
		{/if}
	{/snippet}
</EntityView>
