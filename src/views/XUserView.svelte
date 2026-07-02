<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.XUser>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XUser>>
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

	const xUser = $derived(selection({
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			name: true,
			description: true,
			location: true,
			websiteUrl: true,
			verified: true,
			createdAt: true,
			$icon: true,
			$profileBanner: true,
			...(open && {
				$$timestamps: true,
				$$posts: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'X user')
	const viewDomId = $derived('xuser-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={xUser}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X user'}
		{:else}
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X user'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? ''), String((entity.username) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['@' + String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X user'}
		{:else}
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{['@' + String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X user'}
				{/snippet}

				{#snippet children(entity)}
					{['@' + String((entity.username) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? ''), String((entity.username) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{@const createdAt0 = prefetched.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = entity.createdAt}
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
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{@const verified = prefetched.verified ?? selection.entitySelector.verified}
					{#if verified !== undefined && verified !== null}
						<div>
							<dt>Verified</dt>
							<dd>
								{String((verified) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const verified = entity.verified ?? selection.entitySelector.verified ?? prefetched.verified}
					{#if verified !== undefined && verified !== null}
						<div>
							<dt>Verified</dt>
							<dd>
								{String((verified) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{@const location = prefetched.location ?? selection.entitySelector.location}
					{#if location !== undefined && location !== null}
						<div>
							<dt>Location</dt>
							<dd>
								{String((location) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const location = entity.location ?? selection.entitySelector.location ?? prefetched.location}
					{#if location !== undefined && location !== null}
						<div>
							<dt>Location</dt>
							<dd>
								{String((location) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={xUser}>
				{#snippet Pending()}
					{@const websiteUrl = prefetched.websiteUrl ?? selection.entitySelector.websiteUrl}
					{#if websiteUrl !== undefined && websiteUrl !== null}
						<div>
							<dt>Website URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(websiteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(websiteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const websiteUrl = entity.websiteUrl ?? selection.entitySelector.websiteUrl ?? prefetched.websiteUrl}
					{#if websiteUrl !== undefined && websiteUrl !== null}
						<div>
							<dt>Website URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(websiteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(websiteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={xUser}>
			{#snippet children(entity)}
				{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
				{#if description === undefined || description === null || description === ''}
					<p data-text="muted">No description available.</p>
				{:else}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
