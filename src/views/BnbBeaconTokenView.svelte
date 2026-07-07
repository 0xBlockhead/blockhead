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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconToken>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BnbBeaconToken>>
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
	const bnbBeaconToken = $derived(selection({
		fields: {
			tokenName: true,
			tokenType: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.symbol ?? prefetched.symbol) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token')
	const viewDomId = $derived('bnb-beacon-token-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconToken_TimestampsView from '$/views/BnbBeaconToken_TimestampsView.svelte'
	import BnbBeaconTokenTransfersView from '$/views/BnbBeaconTokenTransfersView.svelte'
	import BnbBeaconTokenMigrationsView from '$/views/BnbBeaconTokenMigrationsView.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconToken}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconToken}>
			{#snippet Pending()}
				{[String((selection.entitySelector.symbol ?? prefetched.symbol) ?? '')].filter(Boolean).join(' ') || title || 'bnb beacon token'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconToken}>
			{#snippet Pending()}
				{[String((prefetched.tokenName) ?? ''), String((prefetched.tokenType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.symbol ?? prefetched.symbol) ?? '')].filter(Boolean).join(' ') || title || 'bnb beacon token'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.tokenName) ?? ''), String((resolvedEntity.tokenType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const symbol = selection.entitySelector.symbol ?? prefetched.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const symbol = resolvedEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							originalSymbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const originalSymbol = prefetched.originalSymbol}
					{#if originalSymbol !== undefined && originalSymbol !== null}
						<div>
							<dt>original symbol</dt>
							<dd>
								{String((originalSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originalSymbol = resolvedEntity.originalSymbol}
					{#if originalSymbol !== undefined && originalSymbol !== null}
						<div>
							<dt>original symbol</dt>
							<dd>
								{String((originalSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenName = prefetched.tokenName}
					{#if tokenName !== undefined && tokenName !== null}
						<div>
							<dt>token name</dt>
							<dd>
								{String((tokenName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenName = resolvedEntity.tokenName}
					{#if tokenName !== undefined && tokenName !== null}
						<div>
							<dt>token name</dt>
							<dd>
								{String((tokenName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenType = prefetched.tokenType}
					{#if tokenType !== undefined && tokenType !== null}
						<div>
							<dt>token type</dt>
							<dd>
								{String((tokenType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenType = resolvedEntity.tokenType}
					{#if tokenType !== undefined && tokenType !== null}
						<div>
							<dt>token type</dt>
							<dd>
								{String((tokenType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownerAddress = prefetched.ownerAddress}
					{#if ownerAddress !== undefined && ownerAddress !== null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerAddress = resolvedEntity.ownerAddress}
					{#if ownerAddress !== undefined && ownerAddress !== null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BnbBeaconToken_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconToken_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BnbBeaconToken_TimestampsView-$$timestamps'
			/>

			<BnbBeaconTokenTransfersView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconTokenTransfer>('$$transfers')}
				title='transfers'
				emptyText='No transfers found.'
				id='BnbBeaconTokenTransfersView-$$transfers'
			/>

			<BnbBeaconTokenMigrationsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconTokenMigration>('$$migrations')}
				title='migrations'
				emptyText='No migrations found.'
				id='BnbBeaconTokenMigrationsView-$$migrations'
			/>
		{/if}
	{/snippet}
</EntityView>
