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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: RegisteredEntityProxyResource<EntityType._GlobalAtprotoNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalAtprotoNetwork>>
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
	const globalAtprotoNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			protocolName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.protocolName) ?? '')].filter(Boolean).join(' ') || [String(('AT Protocol') ?? '')].filter(Boolean).join(' ') || 'AT Protocol')
	const viewDomId = $derived('-global-atproto-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAtprotoNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? (pendingEntity.scope === '_GlobalAtprotoNetwork' ? resolve('/atproto') : undefined)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalAtprotoNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			AT Protocol is a DID-based social protocol. This hub shows bounded actor and post windows from declared Bluesky-compatible appview sources, not a claim about every repository on the network.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									protocolName: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocolName = resolvedEntity.protocolName}
							{#if protocolName !== undefined && protocolName !== null}
								{String((protocolName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								relationshipModel: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const relationshipModel = resolvedEntity.relationshipModel}
						{#if relationshipModel !== undefined && relationshipModel !== null}
							<div>
								<dt>Connection model</dt>
								<dd>
									{String((relationshipModel) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Home</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									sources: selection.sources,
									fields: {
										homeUrl: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const homeUrl = resolvedEntity.homeUrl}
								{#if homeUrl !== undefined && homeUrl !== null}
									<svelte:element
										this={'a'}
										href={String(homeUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(homeUrl)} />
									</svelte:element>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								docsUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const docsUrl = resolvedEntity.docsUrl}
						{#if docsUrl !== undefined && docsUrl !== null}
							<div>
								<dt>Documentation</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(docsUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(docsUrl)} />
									</svelte:element>
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
			<CollapsibleTabs
				id={viewDomId + '-carousel-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'accounts',
							label: 'Accounts',
						},
						{
							id: 'recent-posts',
							label: 'Recent posts',
						},
					]
				}
				data-card
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Directory and examples</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Bounded observeds and example routes from declared AT Protocol appviews.
								</p>
							{/snippet}

							<abbr
								class="entity-heading-tip"
								aria-label='Directory and examples help'
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet SectionAccounts({ id, label, open })}
					<AtprotoActorsView
						selection={
							selection.$$observedActors({
								sources: [
									Source.Constants_Internal,
									Source.Atproto_Xrpc,
								],
							})
						}
						href={resolve('/atproto/actors')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No accounts available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRecentPosts({ id, label, open })}
					<AtprotoPostsView
						selection={
							selection.$$observedPosts({
								sources: [
									Source.Constants_Internal,
									Source.Atproto_Xrpc,
								],
							})
						}
						href={resolve('/atproto/posts')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No recent posts available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
