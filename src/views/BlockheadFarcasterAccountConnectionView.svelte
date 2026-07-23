<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadFarcasterAccountConnection>
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
	const blockheadFarcasterAccountConnection = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			authMethod: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			authMethod: true,
			selected: true,
		},
	}))
	const titleFallback = 'Blockhead Farcaster account connection'
	const viewDomId = $derived('blockhead-farcaster-account-connection-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'connectionId' in selection.entitySelector
			&& selection.entitySelector.connectionId != null ?
				resolve('/farcaster/account/[connectionId=stringSegment]', {
			connectionId: String(selection.entitySelector.connectionId ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet children(entity)}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$user}
				>
					{#snippet children(farcasterUser)}
						{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
						<FarcasterUserView
							selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
							prefetched={farcasterUser}
							href=""
							layout={EntityLayout.Value}
							open={false}
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
										(
											farcasterUser[EntityMetaKey.Selector] != null && 'fid' in farcasterUser[EntityMetaKey.Selector]
											&& farcasterUser[EntityMetaKey.Selector].fid != null ?
												resolve('/farcaster/user/[userId=farcasterFid]', {
											userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
										})
										:
												undefined
										)
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
