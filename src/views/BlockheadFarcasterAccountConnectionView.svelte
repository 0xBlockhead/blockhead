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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadFarcasterAccountConnection>>
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

	const blockheadFarcasterAccountConnection = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			$icon: true,
			...(open && {
				bio: true,
				verifications: true,
				custody: true,
				authMethod: true,
				signedAt: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || 'Blockhead Farcaster account connection')
	const viewDomId = $derived('blockhead-farcaster-account-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
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
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? ''), String((entity.username) ?? ''), String((entity.fid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.fid) ?? '')].filter(Boolean).join(' ') || [String((entity.displayName) ?? ''), String((entity.username) ?? ''), String((entity.fid) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const username0 = prefetched.username}
			{#if username0 !== undefined && username0 !== null}
				<span data-text="muted">
					<span>@</span>
					{String((username0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{@const username0 = prefetched.username}
					{#if username0 !== undefined && username0 !== null}
						<span data-text="muted">
							<span>@</span>
							{String((username0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const username0 = entity.username}
					{#if username0 !== undefined && username0 !== null}
						<span data-text="muted">
							<span>@</span>
							{String((username0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{@const custody = prefetched.custody ?? selection.entitySelector.custody}
					{#if custody !== undefined && custody !== null}
						<div>
							<dt>Custody</dt>
							<dd>
								<TruncatedValue value={String(custody)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const custody = entity.custody ?? selection.entitySelector.custody ?? prefetched.custody}
					{#if custody !== undefined && custody !== null}
						<div>
							<dt>Custody</dt>
							<dd>
								<TruncatedValue value={String(custody)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{@const authMethod = prefetched.authMethod ?? selection.entitySelector.authMethod}
					{#if authMethod !== undefined && authMethod !== null}
						<div>
							<dt>Auth method</dt>
							<dd>
								{String((authMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const authMethod = entity.authMethod ?? selection.entitySelector.authMethod ?? prefetched.authMethod}
					{#if authMethod !== undefined && authMethod !== null}
						<div>
							<dt>Auth method</dt>
							<dd>
								{String((authMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet Pending()}
					{@const signedAt = prefetched.signedAt ?? selection.entitySelector.signedAt}
					{#if signedAt !== undefined && signedAt !== null}
						<div>
							<dt>Signed</dt>
							<dd>
								<Timestamp timestamp={Number(signedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const signedAt = entity.signedAt ?? selection.entitySelector.signedAt ?? prefetched.signedAt}
					{#if signedAt !== undefined && signedAt !== null}
						<div>
							<dt>Signed</dt>
							<dd>
								<Timestamp timestamp={Number(signedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
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
