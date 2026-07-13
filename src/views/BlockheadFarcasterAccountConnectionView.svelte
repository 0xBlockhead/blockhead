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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
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
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? ''), String((pendingEntity.username) ?? ''), String((pendingEntity.fid) ?? '')].filter(Boolean).join(' ') || 'Blockhead Farcaster account connection')
	const viewDomId = $derived('blockhead-farcaster-account-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
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
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet Pending()}
				{[String((pendingEntity.displayName) ?? ''), String((pendingEntity.username) ?? ''), String((pendingEntity.fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.fid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet Pending()}
				{[String((pendingEntity.fid) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.displayName) ?? ''), String((pendingEntity.username) ?? ''), String((pendingEntity.fid) ?? '')].filter(Boolean).join(' ') || title || 'Blockhead Farcaster account connection'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.fid) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.fid) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet Pending()}
				{@const username0 = pendingEntity.username}
				{#if username0 !== undefined && username0 !== null}
					<span data-text="muted">
						<span>@</span>
						{String((username0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const username0 = resolvedEntity.username}
				{#if username0 !== undefined && username0 !== null}
					<span data-text="muted">
						<span>@</span>
						{String((username0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>FID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fid = pendingEntity.fid}
							{#if fid !== undefined && fid !== null}
								<NumberValue value={Number(fid)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fid = resolvedEntity.fid}
							{#if fid !== undefined && fid !== null}
								<NumberValue value={Number(fid)} />
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
						fields: {
							username: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const username = pendingEntity.username}
					{#if username !== undefined && username !== null}
						<div>
							<dt>Username</dt>
							<dd>
								<span>@</span>
								{String((username) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const username = resolvedEntity.username}
					{#if username !== undefined && username !== null}
						<div>
							<dt>Username</dt>
							<dd>
								<span>@</span>
								{String((username) ?? '')}
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
							custody: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const custody = pendingEntity.custody}
					{#if custody !== undefined && custody !== null}
						<div>
							<dt>Custody</dt>
							<dd>
								<TruncatedValue value={String((custody) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const custody = resolvedEntity.custody}
					{#if custody !== undefined && custody !== null}
						<div>
							<dt>Custody</dt>
							<dd>
								<TruncatedValue value={String((custody) ?? '')} />
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
							authMethod: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authMethod = pendingEntity.authMethod}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authMethod = resolvedEntity.authMethod}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							signedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signedAt = pendingEntity.signedAt}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signedAt = resolvedEntity.signedAt}
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

		<ResourceBoundary
			resource={
				selection({
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
</EntityView>
