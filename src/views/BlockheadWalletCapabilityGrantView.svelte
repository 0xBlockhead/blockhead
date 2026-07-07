<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletCapabilityGrant>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletCapabilityGrant>>
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
	const blockheadWalletCapabilityGrant = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			authorizationKind: true,
			issuer: true,
			audience: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.grantId ?? prefetched.grantId) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet capability grant')
	const viewDomId = $derived('blockhead-wallet-capability-grant-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import BlockheadWalletAccountView from '$/views/BlockheadWalletAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletCapabilityGrant}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletCapabilityGrant}>
			{#snippet Pending()}
				{[String((selection.entitySelector.grantId ?? prefetched.grantId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet capability grant'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.grantId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletCapabilityGrant}>
			{#snippet Pending()}
				{[String((prefetched.authorizationKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.grantId ?? prefetched.grantId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet capability grant'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.authorizationKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.grantId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>grant ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									grantId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const grantId = selection.entitySelector.grantId ?? prefetched.grantId}
							{#if grantId !== undefined && grantId !== null}
								{String((grantId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const grantId = resolvedEntity.grantId}
							{#if grantId !== undefined && grantId !== null}
								{String((grantId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadWalletConnection, false>('$connection')}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null && blockheadWalletConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									prefetched={blockheadWalletConnection}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadWalletAccount, false>('$account')}
			>
				{#snippet children(blockheadWalletAccount)}
					{#if blockheadWalletAccount != null && blockheadWalletAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<BlockheadWalletAccountView
									selection={select(EntityType.BlockheadWalletAccount, blockheadWalletAccount[EntityMetaKey.Selector])}
									prefetched={blockheadWalletAccount}
									layout={EntityLayout.Value}
									open={false}
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
						resource={
							selection({
								fields: {
									authorizationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const authorizationKind = prefetched.authorizationKind}
							{#if authorizationKind !== undefined && authorizationKind !== null}
								{String((authorizationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const authorizationKind = resolvedEntity.authorizationKind}
							{#if authorizationKind !== undefined && authorizationKind !== null}
								{String((authorizationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const issuer = prefetched.issuer}
					{#if issuer !== undefined && issuer !== null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={String((issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuer = resolvedEntity.issuer}
					{#if issuer !== undefined && issuer !== null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={String((issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							audience: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const audience = prefetched.audience}
					{#if audience !== undefined && audience !== null}
						<div>
							<dt>audience</dt>
							<dd>
								{String((audience) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const audience = resolvedEntity.audience}
					{#if audience !== undefined && audience !== null}
						<div>
							<dt>audience</dt>
							<dd>
								{String((audience) ?? '')}
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
							selection({
								fields: {
									methods: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const methods = prefetched.methods}
							{#if methods !== undefined && methods !== null}
								{methods.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const methods = resolvedEntity.methods}
							{#if methods !== undefined && methods !== null}
								{methods.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>resources</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									resources: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const resources = prefetched.resources}
							{#if resources !== undefined && resources !== null}
								{resources.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const resources = resolvedEntity.resources}
							{#if resources !== undefined && resources !== null}
								{resources.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofKind = prefetched.proofKind}
					{#if proofKind !== undefined && proofKind !== null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{String((proofKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofKind = resolvedEntity.proofKind}
					{#if proofKind !== undefined && proofKind !== null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{String((proofKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofSummary: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofSummary = prefetched.proofSummary}
					{#if proofSummary !== undefined && proofSummary !== null}
						<div>
							<dt>proof summary</dt>
							<dd>
								{String((proofSummary) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofSummary = resolvedEntity.proofSummary}
					{#if proofSummary !== undefined && proofSummary !== null}
						<div>
							<dt>proof summary</dt>
							<dd>
								{String((proofSummary) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rawGrant: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rawGrant = prefetched.rawGrant}
					{#if rawGrant !== undefined && rawGrant !== null}
						<div>
							<dt>raw grant</dt>
							<dd>
								{String((rawGrant) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rawGrant = resolvedEntity.rawGrant}
					{#if rawGrant !== undefined && rawGrant !== null}
						<div>
							<dt>raw grant</dt>
							<dd>
								{String((rawGrant) ?? '')}
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
							issuedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const issuedAt = prefetched.issuedAt}
					{#if issuedAt !== undefined && issuedAt !== null}
						<div>
							<dt>issued AT</dt>
							<dd>
								<Timestamp timestamp={Number(issuedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuedAt = resolvedEntity.issuedAt}
					{#if issuedAt !== undefined && issuedAt !== null}
						<div>
							<dt>issued AT</dt>
							<dd>
								<Timestamp timestamp={Number(issuedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							notBefore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const notBefore = prefetched.notBefore}
					{#if notBefore !== undefined && notBefore !== null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={Number(notBefore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const notBefore = resolvedEntity.notBefore}
					{#if notBefore !== undefined && notBefore !== null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={Number(notBefore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiresAt = prefetched.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiresAt = resolvedEntity.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revokedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revokedAt = prefetched.revokedAt}
					{#if revokedAt !== undefined && revokedAt !== null}
						<div>
							<dt>revoked AT</dt>
							<dd>
								<Timestamp timestamp={Number(revokedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revokedAt = resolvedEntity.revokedAt}
					{#if revokedAt !== undefined && revokedAt !== null}
						<div>
							<dt>revoked AT</dt>
							<dd>
								<Timestamp timestamp={Number(revokedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
