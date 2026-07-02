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
			selection: EntityProxyResource<typeof schema, EntityType.LensAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LensAccount>>
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

	const lensAccount = $derived(selection({
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			displayName: true,
			bio: true,
			createdAt: true,
			$icon: true,
			...(open && {
				legacyProfileId: true,
				owner: true,
				score: true,
				isMemberOf: true,
				iconUrl: true,
				$$posts: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || 'Lens account')
	const viewDomId = $derived('lens-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={lensAccount}>
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
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || 'Lens account'}
		{:else}
			<ResourceBoundary resource={lensAccount}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || 'Lens account'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? ''), String((entity.localName) ?? ''), String((entity.address) ?? ''), String((entity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || 'Lens account'}
		{:else}
			<ResourceBoundary resource={lensAccount}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).address) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || title || 'Lens account'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.localName) ?? ''), String((entity.address) ?? ''), String((entity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || [String((entity.displayName) ?? ''), String((entity.localName) ?? ''), String((entity.address) ?? ''), String((entity.legacyProfileId) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
			<ResourceBoundary resource={lensAccount}>
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
			<ResourceBoundary resource={lensAccount}>
				{#snippet Pending()}
					{@const owner = prefetched.owner ?? selection.entitySelector.owner}
					{#if owner !== undefined && owner !== null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String(owner)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const owner = entity.owner ?? selection.entitySelector.owner ?? prefetched.owner}
					{#if owner !== undefined && owner !== null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String(owner)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensAccount}>
				{#snippet Pending()}
					{@const score = prefetched.score ?? selection.entitySelector.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue value={Number(score)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const score = entity.score ?? selection.entitySelector.score ?? prefetched.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue value={Number(score)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensAccount}>
				{#snippet Pending()}
					{@const iconUrl = prefetched.iconUrl ?? selection.entitySelector.iconUrl}
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

				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl ?? selection.entitySelector.iconUrl ?? prefetched.iconUrl}
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

		<ResourceBoundary resource={lensAccount}>
			{#snippet children(entity)}
				{@const bio = entity.bio ?? selection.entitySelector.bio ?? prefetched.bio}
				{#if bio === undefined || bio === null || bio === ''}
					<p data-text="muted">No bio available.</p>
				{:else}
					<p data-text="long-text">{String((bio) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
