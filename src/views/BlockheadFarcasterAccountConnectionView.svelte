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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadFarcasterAccountConnection>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadFarcasterAccountConnection>>
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
		sources: selection.sources,
		fields: {
			authMethod: true,
			selected: true,
		},
	}))
	const titleFallback = $derived('Blockhead Farcaster account connection')
	const viewDomId = $derived('blockhead-farcaster-account-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.connectionId !== undefined ? resolve('/farcaster/account/[connectionId=stringSegment]', {
			connectionId: String(pendingEntity.connectionId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
							<FarcasterUserView
								selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
								prefetched={farcasterUser}
								href={
								(farcasterUser[EntityMetaKey.Selector].fid !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]', {
									userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
								}) : undefined)
							}
								layout={EntityLayout.Value}
								open={false}
							/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
							<FarcasterUserView
								selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
								prefetched={farcasterUser}
								href={
								(farcasterUser[EntityMetaKey.Selector].fid !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]', {
									userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
								}) : undefined)
							}
								layout={EntityLayout.Value}
								open={false}
							/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const authMethod0 = pendingEntity.authMethod}
			{#if authMethod0 !== undefined && authMethod0 !== null}
				<span data-text="muted">
					{String((authMethod0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authMethod0 = resolvedEntity.authMethod}
					{#if authMethod0 !== undefined && authMethod0 !== null}
						<span data-text="muted">
							{String((authMethod0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Farcaster user</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
									prefetched={farcasterUser}
									href={
										(farcasterUser[EntityMetaKey.Selector].fid !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]', {
											userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Verified signer</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									signerAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signerAddress = resolvedEntity.signerAddress}
							{#if signerAddress !== undefined && signerAddress !== null}
								<TruncatedValue value={String((signerAddress) ?? '')} />
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
							authMethod: true,
						},
					})
				}
			>
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
			<div>
				<dt>Verified</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									verifiedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verifiedAt = resolvedEntity.verifiedAt}
							{#if verifiedAt !== undefined && verifiedAt !== null}
								<Timestamp timestamp={Number(verifiedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Expires</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									expiresAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const expiresAt = resolvedEntity.expiresAt}
							{#if expiresAt !== undefined && expiresAt !== null}
								<Timestamp timestamp={Number(expiresAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Association fingerprint</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									associationFingerprint: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const associationFingerprint = resolvedEntity.associationFingerprint}
							{#if associationFingerprint !== undefined && associationFingerprint !== null}
								<TruncatedValue value={String((associationFingerprint) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Selected viewer</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									selected: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const selected = resolvedEntity.selected}
							{#if selected !== undefined && selected !== null}
								{selected ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
