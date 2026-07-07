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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAmm>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XrplAmm>>
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
	const xrplAmm = $derived(selection({}))
	const titleFallback = $derived('XRPL AMM')
	const viewDomId = $derived('xrpl-amm-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplNetworkView from '$/views/XrplNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmm}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplAmm}>
			{#snippet Pending()}
				{title || 'XRPL AMM'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<XrplNetworkView
						selection={select(EntityType.XrplNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>AMM account</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ammAccount: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ammAccount = selection.entitySelector.ammAccount ?? prefetched.ammAccount}
							{#if ammAccount !== undefined && ammAccount !== null}
								<TruncatedValue value={String((ammAccount) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ammAccount = resolvedEntity.ammAccount}
							{#if ammAccount !== undefined && ammAccount !== null}
								<TruncatedValue value={String((ammAccount) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>asset currency</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetCurrency: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetCurrency = prefetched.assetCurrency}
							{#if assetCurrency !== undefined && assetCurrency !== null}
								{String((assetCurrency) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetCurrency = resolvedEntity.assetCurrency}
							{#if assetCurrency !== undefined && assetCurrency !== null}
								{String((assetCurrency) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetIssuer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetIssuer = prefetched.assetIssuer}
					{#if assetIssuer !== undefined && assetIssuer !== null}
						<div>
							<dt>asset issuer</dt>
							<dd>
								<TruncatedValue value={String((assetIssuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetIssuer = resolvedEntity.assetIssuer}
					{#if assetIssuer !== undefined && assetIssuer !== null}
						<div>
							<dt>asset issuer</dt>
							<dd>
								<TruncatedValue value={String((assetIssuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>asset2 currency</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									asset2Currency: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const asset2Currency = prefetched.asset2Currency}
							{#if asset2Currency !== undefined && asset2Currency !== null}
								{String((asset2Currency) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const asset2Currency = resolvedEntity.asset2Currency}
							{#if asset2Currency !== undefined && asset2Currency !== null}
								{String((asset2Currency) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							asset2Issuer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const asset2Issuer = prefetched.asset2Issuer}
					{#if asset2Issuer !== undefined && asset2Issuer !== null}
						<div>
							<dt>asset2 issuer</dt>
							<dd>
								<TruncatedValue value={String((asset2Issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const asset2Issuer = resolvedEntity.asset2Issuer}
					{#if asset2Issuer !== undefined && asset2Issuer !== null}
						<div>
							<dt>asset2 issuer</dt>
							<dd>
								<TruncatedValue value={String((asset2Issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lpTokenCurrency: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lpTokenCurrency = prefetched.lpTokenCurrency}
					{#if lpTokenCurrency !== undefined && lpTokenCurrency !== null}
						<div>
							<dt>LP token currency</dt>
							<dd>
								{String((lpTokenCurrency) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lpTokenCurrency = resolvedEntity.lpTokenCurrency}
					{#if lpTokenCurrency !== undefined && lpTokenCurrency !== null}
						<div>
							<dt>LP token currency</dt>
							<dd>
								{String((lpTokenCurrency) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
