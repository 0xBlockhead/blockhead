<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashViewingKey>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZcashViewingKey>>
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
	const blockheadZcashViewingKey = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashdWallet_JsonRpc,
		],
		fields: {
			$network: true,
			keyKind: true,
			canViewIncoming: true,
			canViewOutgoing: true,
			canSpend: true,
			importedAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.keyFingerprint ?? prefetched.keyFingerprint) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash viewing key')
	const viewDomId = $derived('blockhead-zcash-viewing-key-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashViewingKey_TimestampsView from '$/views/BlockheadZcashViewingKey_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashViewingKey}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZcashViewingKey}>
			{#snippet Pending()}
				{[String((selection.entitySelector.keyFingerprint ?? prefetched.keyFingerprint) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zcash viewing key'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.keyFingerprint) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashViewingKey}>
			{#snippet Pending()}
				{[String((prefetched.keyKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.keyFingerprint ?? prefetched.keyFingerprint) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zcash viewing key'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.keyKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.keyFingerprint) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashViewingKey}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
				>
					{#snippet children(network)}
						<span data-text="muted">
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								href={
									(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
										caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
									}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
										networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
				>
					{#snippet children(network)}
						<span data-text="muted">
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								href={
									(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
										caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
									}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
										networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = selection.entitySelector.walletId ?? prefetched.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadWallet, false>('$wallet')}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
					>
						{#snippet children(network)}
							{#if network[EntityMetaKey.Selector] != null}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>key fingerprint</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keyFingerprint: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyFingerprint = selection.entitySelector.keyFingerprint ?? prefetched.keyFingerprint}
							{#if keyFingerprint !== undefined && keyFingerprint !== null}
								{String((keyFingerprint) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyFingerprint = resolvedEntity.keyFingerprint}
							{#if keyFingerprint !== undefined && keyFingerprint !== null}
								{String((keyFingerprint) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>key kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keyKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyKind = prefetched.keyKind}
							{#if keyKind !== undefined && keyKind !== null}
								{String((keyKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyKind = resolvedEntity.keyKind}
							{#if keyKind !== undefined && keyKind !== null}
								{String((keyKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pools: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pools = prefetched.pools}
					{#if pools !== undefined && pools !== null}
						<div>
							<dt>pools</dt>
							<dd>
								{String((pools) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pools = resolvedEntity.pools}
					{#if pools !== undefined && pools !== null}
						<div>
							<dt>pools</dt>
							<dd>
								{String((pools) ?? '')}
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
							accountIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountIndex = prefetched.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountIndex = resolvedEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							birthdayHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const birthdayHeight = prefetched.birthdayHeight}
					{#if birthdayHeight !== undefined && birthdayHeight !== null}
						<div>
							<dt>birthday height</dt>
							<dd>
								<NumberValue value={Number(birthdayHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const birthdayHeight = resolvedEntity.birthdayHeight}
					{#if birthdayHeight !== undefined && birthdayHeight !== null}
						<div>
							<dt>birthday height</dt>
							<dd>
								<NumberValue value={Number(birthdayHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>can view incoming</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									canViewIncoming: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const canViewIncoming = prefetched.canViewIncoming}
							{#if canViewIncoming !== undefined && canViewIncoming !== null}
								{canViewIncoming ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canViewIncoming = resolvedEntity.canViewIncoming}
							{#if canViewIncoming !== undefined && canViewIncoming !== null}
								{canViewIncoming ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>can view outgoing</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									canViewOutgoing: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const canViewOutgoing = prefetched.canViewOutgoing}
							{#if canViewOutgoing !== undefined && canViewOutgoing !== null}
								{canViewOutgoing ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canViewOutgoing = resolvedEntity.canViewOutgoing}
							{#if canViewOutgoing !== undefined && canViewOutgoing !== null}
								{canViewOutgoing ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>can spend</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									canSpend: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const canSpend = prefetched.canSpend}
							{#if canSpend !== undefined && canSpend !== null}
								{canSpend ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canSpend = resolvedEntity.canSpend}
							{#if canSpend !== undefined && canSpend !== null}
								{canSpend ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>imported AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									importedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const importedAt = prefetched.importedAt}
							{#if importedAt !== undefined && importedAt !== null}
								<Timestamp timestamp={Number(importedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const importedAt = resolvedEntity.importedAt}
							{#if importedAt !== undefined && importedAt !== null}
								<Timestamp timestamp={Number(importedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							viewingKeyMaterial: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewingKeyMaterial = prefetched.viewingKeyMaterial}
					{#if viewingKeyMaterial !== undefined && viewingKeyMaterial !== null}
						<div>
							<dt>viewing key material</dt>
							<dd>
								{String((viewingKeyMaterial) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewingKeyMaterial = resolvedEntity.viewingKeyMaterial}
					{#if viewingKeyMaterial !== undefined && viewingKeyMaterial !== null}
						<div>
							<dt>viewing key material</dt>
							<dd>
								{String((viewingKeyMaterial) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadZcashViewingKey_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadZcashViewingKey_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Zcash viewing-key observations.'
				id='BlockheadZcashViewingKey_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
