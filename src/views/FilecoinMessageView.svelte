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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinMessage>>
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
		sources: [
			Source.Filfox_Rest,
		],
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
		<ResourceBoundary resource={filecoinMessage}>
			{#snippet Pending()}
				{@const cid0 = pendingEntity.cid}
				{#if cid0 !== undefined && cid0 !== null}
					<TruncatedValue value={String((cid0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const cid0 = resolvedEntity.cid}
				{#if cid0 !== undefined && cid0 !== null}
					<TruncatedValue value={String((cid0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinMessage}>
			{#snippet Pending()}
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
								layout={EntityLayout.Value}
								open={false}
							/>
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
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
								layout={EntityLayout.Value}
								open={false}
							/>
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
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMessage}>
			{#snippet Pending()}
				{@const valueAttoFil0 = pendingEntity.valueAttoFil}
				{#if valueAttoFil0 !== undefined && valueAttoFil0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(valueAttoFil0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const valueAttoFil0 = resolvedEntity.valueAttoFil}
				{#if valueAttoFil0 !== undefined && valueAttoFil0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(valueAttoFil0)} />
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
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cid = pendingEntity.cid}
							{#if cid !== undefined && cid !== null}
								<TruncatedValue value={String((cid) ?? '')} />
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>From</dt>
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
					selection.$to({
						sources: [
							Source.Filfox_Rest,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
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
							Source.Filfox_Rest,
						],
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const method = pendingEntity.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>Method</dt>
							<dd>
								<NumberValue value={Number(method)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const method = resolvedEntity.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>Method</dt>
							<dd>
								<NumberValue value={Number(method)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Filfox_Rest,
						],
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = pendingEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Filfox_Rest,
						],
						fields: {
							valueAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueAttoFil = pendingEntity.valueAttoFil}
					{#if valueAttoFil !== undefined && valueAttoFil !== null}
						<div>
							<dt>Value attoFIL</dt>
							<dd>
								<NumberValue value={Number(valueAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueAttoFil = resolvedEntity.valueAttoFil}
					{#if valueAttoFil !== undefined && valueAttoFil !== null}
						<div>
							<dt>Value attoFIL</dt>
							<dd>
								<NumberValue value={Number(valueAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Filfox_Rest,
						],
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasLimit = pendingEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue value={Number(gasLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasLimit = resolvedEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue value={Number(gasLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
