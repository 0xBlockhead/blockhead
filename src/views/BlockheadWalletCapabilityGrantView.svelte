<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletCapabilityGrant>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletCapabilityGrant = $derived(viewSelection({
		fields: {
			authorizationKind: true,
			issuer: true,
			audience: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.grantId || 'blockhead wallet capability grant')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletCapabilityGrant}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/wallet/capability-grant/[grantId=stringSegment]',
				{
					grantId: selection.entitySelector.grantId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletCapabilityGrant}>
			{#snippet children(entity)}
				{entity.authorizationKind || selection.entitySelector.grantId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>grant ID</dt>
				<dd>
					{selection.entitySelector.grantId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
						{@const blockheadWalletConnectionInitial = untrack(() => blockheadWalletConnection)}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, (blockheadWalletConnection ?? blockheadWalletConnectionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(account)}
					{#if account != null}
						{@const accountInitial = untrack(() => account)}
						<div>
							<dt>account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, (account ?? accountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>authorization kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletCapabilityGrant}
					>
						{#snippet children(entity)}
							{entity.authorizationKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadWalletCapabilityGrant}
			>
				{#snippet children(entity)}
					{@const issuer = entity.issuer}
					{#if issuer != null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={issuer} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadWalletCapabilityGrant}
			>
				{#snippet children(entity)}
					{@const audience = entity.audience}
					{#if audience != null}
						<div>
							<dt>audience</dt>
							<dd>
								{audience}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>methods</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									methods: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.methods.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>resources</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									resources: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.resources.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proofKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofKind = entity.proofKind}
					{#if proofKind != null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{proofKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proofSummary: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofSummary = entity.proofSummary}
					{#if proofSummary != null}
						<div>
							<dt>proof summary</dt>
							<dd>
								{proofSummary}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rawGrant: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rawGrant = entity.rawGrant}
					{#if rawGrant != null}
						<div>
							<dt>raw grant</dt>
							<dd>
								{rawGrant}
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
							issuedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuedAt = entity.issuedAt}
					{#if issuedAt != null}
						<div>
							<dt>issued AT</dt>
							<dd>
								<Timestamp timestamp={issuedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							notBefore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const notBefore = entity.notBefore}
					{#if notBefore != null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={notBefore} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiresAt = entity.expiresAt}
					{#if expiresAt != null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={expiresAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revokedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revokedAt = entity.revokedAt}
					{#if revokedAt != null}
						<div>
							<dt>revoked AT</dt>
							<dd>
								<Timestamp timestamp={revokedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
