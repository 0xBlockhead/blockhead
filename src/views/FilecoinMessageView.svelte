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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinMessage>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinMessage>>
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
	const filecoinMessage = $derived(selection({
		sources: selection.sources,
		fields: {
			valueAttoFil: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'filecoin message')
	const viewDomId = $derived('filecoin-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const cid0 = pendingEntity.cid}
					{#if cid0 !== undefined && cid0 !== null}
						<TruncatedValue value={String((cid0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cid0 = resolvedEntity.cid}
					{#if cid0 !== undefined && cid0 !== null}
						<TruncatedValue value={String((cid0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={
						selection.$from({
							sources: [
								Source.Filfox_Rest,
							],
						})
					}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
						selection.$to({
							sources: [
								Source.Filfox_Rest,
							],
						})
					}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={filecoinMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={
						selection.$from({
							sources: [
								Source.Filfox_Rest,
							],
						})
					}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
						selection.$to({
							sources: [
								Source.Filfox_Rest,
							],
						})
					}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const valueAttoFil0 = pendingEntity.valueAttoFil}
			{#if valueAttoFil0 !== undefined && valueAttoFil0 !== null}
				<span data-text="muted">
					<NumberValue
						value={valueAttoFil0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinMessage}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueAttoFil0 = resolvedEntity.valueAttoFil}
					{#if valueAttoFil0 !== undefined && valueAttoFil0 !== null}
						<span data-text="muted">
							<NumberValue
								value={valueAttoFil0}
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
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cid = resolvedEntity.cid}
							{#if cid !== undefined && cid !== null}
								<TruncatedValue value={String((cid) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection.$from({
						sources: [
							Source.Filfox_Rest,
						],
					})
				}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>From</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
										(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
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
					selection.$to({
						sources: [
							Source.Filfox_Rest,
						],
					})
				}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
										(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
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
						sources: selection.sources,
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const method = resolvedEntity.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>Method</dt>
							<dd>
								<NumberValue
									value={method}
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
							valueAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueAttoFil = resolvedEntity.valueAttoFil}
					{#if valueAttoFil !== undefined && valueAttoFil !== null}
						<div>
							<dt>Value attoFIL</dt>
							<dd>
								<NumberValue
									value={valueAttoFil}
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
							gasLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasLimit = resolvedEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue
									value={gasLimit}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
