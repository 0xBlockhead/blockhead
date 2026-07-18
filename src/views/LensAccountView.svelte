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
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.LensAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LensAccount>>
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
	const lensAccount = $derived(selection({
		sources: selection.sources,
		fields: {
			displayName: true,
			bio: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? ''), String((pendingEntity.localName) ?? ''), String((pendingEntity.address) ?? ''), String((pendingEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || 'Lens account')
	const viewDomId = $derived('lens-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import LensAccount_TimestampsView from '$/views/LensAccount_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.address !== undefined ? resolve('/lens/account/[address=evmAddress]', {
			address: String(pendingEntity.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.displayName) ?? ''), String((pendingEntity.localName) ?? ''), String((pendingEntity.address) ?? ''), String((pendingEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={lensAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.localName) ?? ''), String((resolvedEntity.address) ?? ''), String((resolvedEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.localName) ?? ''), String((pendingEntity.address) ?? ''), String((pendingEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.displayName) ?? ''), String((pendingEntity.localName) ?? ''), String((pendingEntity.address) ?? ''), String((pendingEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={lensAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.localName) ?? ''), String((resolvedEntity.address) ?? ''), String((resolvedEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.localName) ?? ''), String((resolvedEntity.address) ?? ''), String((resolvedEntity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={lensAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							localName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localName = resolvedEntity.localName}
					{#if localName !== undefined && localName !== null}
						<div>
							<dt>Local name</dt>
							<dd>
								{String((localName) ?? '')}
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
							legacyProfileId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const legacyProfileId = resolvedEntity.legacyProfileId}
					{#if legacyProfileId !== undefined && legacyProfileId !== null}
						<div>
							<dt>Legacy profile ID</dt>
							<dd>
								{String((legacyProfileId) ?? '')}
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
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const owner = resolvedEntity.owner}
					{#if owner !== undefined && owner !== null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String((owner) ?? '')} />
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
							createdAt: true,
						},
					})
				}
			>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							score: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const score = resolvedEntity.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue
									value={score}
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
							iconUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const iconUrl = resolvedEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						bio: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const bio = resolvedEntity.bio}
				{#if bio !== undefined && bio !== null && bio !== ''}
					<p data-text="long-text">{String((bio) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-lens-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lens-account-posts',
							label: 'Posts',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLensAccountPosts({ id, label, open })}
					<LensPostsView
						selection={
							selection.$$posts({
								sources: [
									Source.Lens_Graphql,
								],
							})
						}
						href={
							(selection.entitySelector.address !== undefined ? resolve('/lens/account/[address=evmAddress]/posts', {
								address: selection.entitySelector.address,
							}) : undefined)
						}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Lens posts for this account.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lens-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lens-account-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLensAccountTimestamps({ id, label, open })}
					<LensAccount_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Lens account observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
