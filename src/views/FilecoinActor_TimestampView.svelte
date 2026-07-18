<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinActor_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinActor_Timestamp>>
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
	const filecoinActorTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			timestampMs: true,
			balanceAttoFil: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin actor timestamp')
	const viewDomId = $derived('filecoin-actor-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinActor_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.height !== undefined && pendingEntity.tipsetKey !== undefined && pendingEntity.source !== undefined && pendingEntity.$actor !== undefined && pendingEntity.$actor.address !== undefined && pendingEntity.$actor.$network !== undefined && pendingEntity.$actor.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
			height: String(pendingEntity.height ?? ''),
			tipsetKey: String(pendingEntity.tipsetKey ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$actor.address ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$actor.$network.caip2) ?? ''),
		}) : pendingEntity.height !== undefined && pendingEntity.tipsetKey !== undefined && pendingEntity.source !== undefined && pendingEntity.$actor !== undefined && pendingEntity.$actor.address !== undefined && pendingEntity.$actor.$network !== undefined && pendingEntity.$actor.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
			height: String(pendingEntity.height ?? ''),
			tipsetKey: String(pendingEntity.tipsetKey ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$actor.address ?? ''),
			network: String(pendingEntity.$actor.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinActorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const balanceAttoFil0 = pendingEntity.balanceAttoFil}
					{#if balanceAttoFil0 !== undefined && balanceAttoFil0 !== null}
						<NumberValue
							value={balanceAttoFil0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinActorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceAttoFil0 = resolvedEntity.balanceAttoFil}
					{#if balanceAttoFil0 !== undefined && balanceAttoFil0 !== null}
						<NumberValue
							value={balanceAttoFil0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const height0 = pendingEntity.height}
			{#if height0 !== undefined && height0 !== null}
				<span data-text="muted">
					<NumberValue
						value={height0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinActorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height0 = resolvedEntity.height}
					{#if height0 !== undefined && height0 !== null}
						<span data-text="muted">
							<NumberValue
								value={height0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Actor</dt>
				<dd>
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.address !== undefined && selection.entitySelector.$actor.$network !== undefined && selection.entitySelector.$actor.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$actor.$network.caip2) ?? ''),
							}) : selection.entitySelector.$actor.address !== undefined && selection.entitySelector.$actor.$network !== undefined && selection.entitySelector.$actor.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
								network: String(selection.entitySelector.$actor.$network.slug ?? ''),
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue
									value={height}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tipsetKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tipsetKey = resolvedEntity.tipsetKey}
							{#if tipsetKey !== undefined && tipsetKey !== null}
								{String((tipsetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tipset</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$tipset({
								sources: [
									Source.Lotus_JsonRpc,
								],
							})
						}
					>
						{#snippet children(filecoinTipset)}
							{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							idAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const idAddress = resolvedEntity.idAddress}
					{#if idAddress !== undefined && idAddress !== null}
						<div>
							<dt>ID address</dt>
							<dd>
								<TruncatedValue value={String((idAddress) ?? '')} />
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
							actorCodeCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const actorCodeCid = resolvedEntity.actorCodeCid}
					{#if actorCodeCid !== undefined && actorCodeCid !== null}
						<div>
							<dt>Actor code CID</dt>
							<dd>
								{String((actorCodeCid) ?? '')}
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
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
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
							balanceAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceAttoFil = resolvedEntity.balanceAttoFil}
					{#if balanceAttoFil !== undefined && balanceAttoFil !== null}
						<div>
							<dt>Balance attoFIL</dt>
							<dd>
								<NumberValue
									value={balanceAttoFil}
								/>
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
							stateRootCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateRootCid = resolvedEntity.stateRootCid}
					{#if stateRootCid !== undefined && stateRootCid !== null}
						<div>
							<dt>State root CID</dt>
							<dd>
								{String((stateRootCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
