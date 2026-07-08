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
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrRelay>>
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
	const nostrRelay = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.relayUrl ?? prefetched.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay')
	const viewDomId = $derived('nostr-relay-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrRelay_TimestampsView from '$/views/NostrRelay_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrRelay}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.relayUrl ?? prefetched.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Relay URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									relayUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const relayUrl = selection.entitySelector.relayUrl ?? prefetched.relayUrl}
							{#if relayUrl !== undefined && relayUrl !== null}
								<TruncatedValue value={String((relayUrl) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const relayUrl = resolvedEntity.relayUrl}
							{#if relayUrl !== undefined && relayUrl !== null}
								<TruncatedValue value={String((relayUrl) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
							Source.NostrRelay_Nip11_Http,
						],
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
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

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								description: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const description = prefetched.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const description = resolvedEntity.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								software: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const software = prefetched.software}
						{#if software !== undefined && software !== null}
							<div>
								<dt>Software</dt>
								<dd>
									{String((software) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const software = resolvedEntity.software}
						{#if software !== undefined && software !== null}
							<div>
								<dt>Software</dt>
								<dd>
									{String((software) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								version: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const version = prefetched.version}
						{#if version !== undefined && version !== null}
							<div>
								<dt>Version</dt>
								<dd>
									{String((version) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const version = resolvedEntity.version}
						{#if version !== undefined && version !== null}
							<div>
								<dt>Version</dt>
								<dd>
									{String((version) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								supportedNipCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const supportedNipCount = prefetched.supportedNipCount}
						{#if supportedNipCount !== undefined && supportedNipCount !== null}
							<div>
								<dt>Supported NIPs</dt>
								<dd>
									<NumberValue value={Number(supportedNipCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const supportedNipCount = resolvedEntity.supportedNipCount}
						{#if supportedNipCount !== undefined && supportedNipCount !== null}
							<div>
								<dt>Supported NIPs</dt>
								<dd>
									<NumberValue value={Number(supportedNipCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								isPaid: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const isPaid = prefetched.isPaid}
						{#if isPaid !== undefined && isPaid !== null}
							<div>
								<dt>Paid relay</dt>
								<dd>
									{isPaid ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const isPaid = resolvedEntity.isPaid}
						{#if isPaid !== undefined && isPaid !== null}
							<div>
								<dt>Paid relay</dt>
								<dd>
									{isPaid ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							fields: {
								limit: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const limit = prefetched.limit}
						{#if limit !== undefined && limit !== null}
							<div>
								<dt>Event limit</dt>
								<dd>
									<NumberValue value={Number(limit)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const limit = resolvedEntity.limit}
						{#if limit !== undefined && limit !== null}
							<div>
								<dt>Event limit</dt>
								<dd>
									<NumberValue value={Number(limit)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NostrRelay_TimestampsView
				selection={selection.$$timestamps}
				title='Relay observations'
				emptyText='No Nostr relay observations.'
				id='NostrRelay_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
