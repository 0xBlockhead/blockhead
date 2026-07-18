<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadWakuNodeState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadWakuNodeState>>
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
	const blockheadWakuNodeState = $derived(selection({
		sources: selection.sources,
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead waku node state')
	const viewDomId = $derived('blockhead-waku-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWakuNodeState_TimestampsView from '$/views/BlockheadWakuNodeState_TimestampsView.svelte'
	import BlockheadWakuMessageObservation_TimestampsView from '$/views/BlockheadWakuMessageObservation_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWakuNodeState}
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
			{[String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadWakuNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadWakuNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const endpoint0 = pendingEntity.endpoint}
			{#if endpoint0 !== undefined && endpoint0 !== null}
				<span data-text="muted">
					<svelte:element
						this={'a'}
						href={String(endpoint0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(endpoint0)} />
					</svelte:element>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadWakuNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpoint0 = resolvedEntity.endpoint}
					{#if endpoint0 !== undefined && endpoint0 !== null}
						<span data-text="muted">
							<svelte:element
								this={'a'}
								href={String(endpoint0)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(endpoint0)} />
							</svelte:element>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
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
							endpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpoint = resolvedEntity.endpoint}
					{#if endpoint !== undefined && endpoint !== null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadWakuNodeState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Waku node-state observations.'
				id='BlockheadWakuNodeState_TimestampsView-timestamps'
			/>

			<BlockheadWakuMessageObservation_TimestampsView
				selection={
						selection.$$messageObservations({
							count: true,
						})
					}
				title='message observations'
				emptyText='No Waku message observations.'
				id='BlockheadWakuMessageObservation_TimestampsView-message-observations'
			/>
		{/if}
	{/snippet}
</EntityView>
