<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterUser>>
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

	const farcasterUser = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			$icon: true,
			...(open && {
				bio: true,
				url: true,
				$primaryEvmAccount: true,
				$$verifiedAddresses: true,
				$$casts: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user')
	const viewDomId = $derived('farcaster-user-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={farcasterUser}>
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
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster user'}
		{:else}
			<ResourceBoundary resource={farcasterUser}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster user'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? ''), String((entity.username) ?? ''), String((entity.fid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster user'}
		{:else}
			<ResourceBoundary resource={farcasterUser}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster user'}
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
			<ResourceBoundary resource={farcasterUser}>
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
			<ResourceBoundary resource={farcasterUser}>
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
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$primaryEvmAccount')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Primary EVM account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={farcasterUser}>
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
