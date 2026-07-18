<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.PayjoinEndpoint>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.PayjoinEndpoint>>
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
	const payjoinEndpoint = $derived(selection({
		sources: selection.sources,
		fields: {
			protocolVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'payjoin endpoint')
	const viewDomId = $derived('payjoin-endpoint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PayjoinEndpoint_TimestampsView from '$/views/PayjoinEndpoint_TimestampsView.svelte'
	import BlockheadPayjoinSessionsView from '$/views/BlockheadPayjoinSessionsView.svelte'
	import PayjoinDirectoryView from '$/views/PayjoinDirectoryView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinEndpoint}
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
			{[String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={payjoinEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.protocolVersion) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={payjoinEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.protocolVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$directory}
			>
				{#snippet children(payjoinDirectory)}
					{#if payjoinDirectory != null && payjoinDirectory[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<PayjoinDirectoryView
								selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
								prefetched={payjoinDirectory}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={payjoinEndpoint}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$directory}
					>
						{#snippet children(payjoinDirectory)}
							{#if payjoinDirectory != null && payjoinDirectory[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<PayjoinDirectoryView
										selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
										prefetched={payjoinDirectory}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>endpoint URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									endpointUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const endpointUrl = resolvedEntity.endpointUrl}
							{#if endpointUrl !== undefined && endpointUrl !== null}
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
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
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolVersion = resolvedEntity.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{String((protocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$directory}
			>
				{#snippet children(payjoinDirectory)}
					{#if payjoinDirectory != null && payjoinDirectory[EntityMetaKey.Selector] != null}
						<div>
							<dt>directory</dt>
							<dd>
								<PayjoinDirectoryView
									selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
									prefetched={payjoinDirectory}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PayjoinEndpoint_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='PayjoinEndpoint_TimestampsView-timestamps'
			/>

			<BlockheadPayjoinSessionsView
				selection={
						selection.$$blockheadSessions({
							count: true,
						})
					}
				title='blockhead sessions'
				emptyText='No local payjoin sessions.'
				id='BlockheadPayjoinSessionsView-blockhead-sessions'
			/>
		{/if}
	{/snippet}
</EntityView>
