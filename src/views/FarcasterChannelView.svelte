<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterChannel>>
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

	const farcasterChannel = $derived(selection({
		sources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
		fields: {
			name: true,
			description: true,
			$icon: true,
			url: true,
			createdAt: true,
			externalLinkUrl: true,
			...(open && {
				$lead: true,
				$moderator: true,
				$$casts: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'Farcaster channel')
	const viewDomId = $derived('farcaster-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={farcasterChannel}>
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
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster channel'}
		{:else}
			<ResourceBoundary resource={farcasterChannel}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster channel'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster channel'}
		{:else}
			<ResourceBoundary resource={farcasterChannel}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster channel'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.id) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
			<ResourceBoundary resource={farcasterChannel}>
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
			<ResourceBoundary resource={farcasterChannel}>
				{#snippet Pending()}
					{@const url = prefetched.url ?? selection.entitySelector.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const url = entity.url ?? selection.entitySelector.url ?? prefetched.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FarcasterUser, false>('$lead')}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						<div>
							<dt>Lead</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser.entitySelector)}
									prefetched={farcasterUser}
									layout={EntityLayout.Title}
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
				resource={selection[EntityProxyField]<EntityType.FarcasterUser, false>('$moderator')}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						<div>
							<dt>Moderator</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser.entitySelector)}
									prefetched={farcasterUser}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterChannel}>
				{#snippet Pending()}
					{@const externalLinkUrl = prefetched.externalLinkUrl ?? selection.entitySelector.externalLinkUrl}
					{#if externalLinkUrl !== undefined && externalLinkUrl !== null}
						<div>
							<dt>External link URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(externalLinkUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(externalLinkUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const externalLinkUrl = entity.externalLinkUrl ?? selection.entitySelector.externalLinkUrl ?? prefetched.externalLinkUrl}
					{#if externalLinkUrl !== undefined && externalLinkUrl !== null}
						<div>
							<dt>External link URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(externalLinkUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(externalLinkUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={farcasterChannel}>
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
