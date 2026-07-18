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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadSocialPostSession>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadSocialPostSession>>
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
	const blockheadSocialPostSession = $derived(selection({
		sources: selection.sources,
		fields: {
			status: true,
			protocol: true,
			createdAt: true,
			updatedAt: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'blockhead social post session')
	const viewDomId = $derived('blockhead-social-post-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaListView from '$/views/MediaListView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSocialPostSession}
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
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSocialPostSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.status) ?? ''), String((pendingEntity.protocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSocialPostSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.protocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const updatedAt0 = pendingEntity.updatedAt}
			{#if updatedAt0 !== undefined && updatedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(updatedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSocialPostSession}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt0 = resolvedEntity.updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(updatedAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
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
							name: true,
						},
					})
				}
			>
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

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocol = resolvedEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
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
							authorKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorKey = resolvedEntity.authorKey}
					{#if authorKey !== undefined && authorKey !== null}
						<div>
							<dt>author key</dt>
							<dd>
								{String((authorKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$walletConnection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null && blockheadWalletConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									prefetched={blockheadWalletConnection}
									href={
										(blockheadWalletConnection[EntityMetaKey.Selector].connectionKey !== undefined ? resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
											connectionKey: String(blockheadWalletConnection[EntityMetaKey.Selector].connectionKey ?? ''),
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
				resource={selection.$agentConversation}
			>
				{#snippet children(blockheadAgentConversation)}
					{#if blockheadAgentConversation != null && blockheadAgentConversation[EntityMetaKey.Selector] != null}
						<div>
							<dt>agent conversation</dt>
							<dd>
								<BlockheadAgentConversationView
									selection={select(EntityType.BlockheadAgentConversation, blockheadAgentConversation[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConversation}
									href={
										(blockheadAgentConversation[EntityMetaKey.Selector].id !== undefined ? resolve('/~/agents/conversation/[conversationId=stringSegment]', {
											conversationId: String(blockheadAgentConversation[EntityMetaKey.Selector].id ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							text: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const text = resolvedEntity.text}
					{#if text !== undefined && text !== null}
						<div>
							<dt>text</dt>
							<dd>
								{String((text) ?? '')}
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
							publishedEntityType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedEntityType = resolvedEntity.publishedEntityType}
					{#if publishedEntityType !== undefined && publishedEntityType !== null}
						<div>
							<dt>published entity type</dt>
							<dd>
								{String((publishedEntityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updatedAt = resolvedEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
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
							lockedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockedAt = resolvedEntity.lockedAt}
					{#if lockedAt !== undefined && lockedAt !== null}
						<div>
							<dt>locked AT</dt>
							<dd>
								<Timestamp timestamp={Number(lockedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MediaListView
				selection={
						selection.$$media({
							count: true,
						})
					}
				title='media'
				emptyText='No media.'
				id='MediaListView-media'
			/>
		{/if}
	{/snippet}
</EntityView>
