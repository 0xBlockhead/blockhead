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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentCredentialState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentCredentialState>>
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
	const blockheadAgentCredentialState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			credentialKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.credentialId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent credential state')
	const viewDomId = $derived('blockhead-agent-credential-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentCredentialState_TimestampsView from '$/views/BlockheadAgentCredentialState_TimestampsView.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentCredentialState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAgentCredentialState}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.credentialId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent credential state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentCredentialState}>
			{#snippet Pending()}
				{[String((pendingEntity.credentialKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.credentialId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent credential state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.credentialKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentCredentialState}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$connection}
				>
					{#snippet children(blockheadAgentConnection)}
						{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$connection}
				>
					{#snippet children(blockheadAgentConnection)}
						{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>credential ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									credentialId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const credentialId = pendingEntity.credentialId}
							{#if credentialId !== undefined && credentialId !== null}
								<TruncatedValue value={String((credentialId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const credentialId = resolvedEntity.credentialId}
							{#if credentialId !== undefined && credentialId !== null}
								<TruncatedValue value={String((credentialId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
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
						fields: {
							credentialKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const credentialKind = pendingEntity.credentialKind}
					{#if credentialKind !== undefined && credentialKind !== null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={String((credentialKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const credentialKind = resolvedEntity.credentialKind}
					{#if credentialKind !== undefined && credentialKind !== null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={String((credentialKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = pendingEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
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
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = pendingEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = pendingEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAgentCredentialState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No credential observations.'
				id='BlockheadAgentCredentialState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
