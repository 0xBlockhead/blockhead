<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.LensAccount> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lens_Graphql,
		],
	}))
	const lensAccount = $derived(viewSelection({
		fields: {
			address: true,
			displayName: true,
			localName: true,
			bio: true,
			createdAt: true,
			legacyProfileId: true,
		},
	}))
	const titleFallback = $derived([(prefetched.displayName ?? ''), (prefetched.localName ?? ''), (prefetched.address ?? ''), (prefetched.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account')
	const viewDomId = $derived('lens-account-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'address' in selection.entitySelector ?
					resolve(
						'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
						{
							address: selection.entitySelector.address,
						}
					)
				:
					'localName' in selection.entitySelector ?
						resolve(
							'/lens/account/name/[localName=stringSegment]',
							{
								localName: selection.entitySelector.localName,
							}
						)
					:
						'legacyProfileId' in selection.entitySelector ?
							resolve(
								'/lens/account/legacy/[legacyProfileId=stringSegment]',
								{
									legacyProfileId: selection.entitySelector.legacyProfileId,
								}
							)
						:
							undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), (entity.localName ?? ''), entity.address, (entity.legacyProfileId ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{[(entity.localName ?? ''), entity.address, (entity.legacyProfileId ?? '')].filter(Boolean).join(' ') || [(entity.displayName ?? ''), (entity.localName ?? ''), entity.address, (entity.legacyProfileId ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={lensAccount}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensAccount}
			>
				{#snippet children(entity)}
					{@const localName = entity.localName}
					{#if localName != null}
						<div>
							<dt>Local name</dt>
							<dd>
								{localName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensAccount}
			>
				{#snippet children(entity)}
					{@const legacyProfileId = entity.legacyProfileId}
					{#if legacyProfileId != null}
						<div>
							<dt>Legacy profile ID</dt>
							<dd>
								{legacyProfileId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const owner = entity.owner}
					{#if owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={owner} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensAccount}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							score: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const score = entity.score}
					{#if score != null}
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
					viewSelection({
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl}
					{#if iconUrl != null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<a
									href={iconUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={iconUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={lensAccount}
		>
			{#snippet children(entity)}
				{@const bio = entity.bio}
				{#if bio != null && bio !== ''}
					<p data-text="long-text">{bio}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionLensAccountPosts({ id, label })}
				<LensPostsView
					selection={selection.$$posts}
					href={
						'address' in selection.entitySelector ?
							resolve(
								'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/posts',
								{
									address: selection.entitySelector.address,
								}
							)
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No Lens posts for this account.'
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

			{#snippet SectionLensAccountTimestamps({ id, label })}
				<LensAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Lens account observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
