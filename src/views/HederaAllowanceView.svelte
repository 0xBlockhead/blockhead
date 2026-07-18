<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.HederaAllowance>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HederaAllowance>>
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
	const hederaAllowance = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('hedera allowance')
	const viewDomId = $derived('hedera-allowance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAllowance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={hederaAllowance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>owner</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$owner, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>spender</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$spender, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>allowance kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									allowanceKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const allowanceKind = resolvedEntity.allowanceKind}
							{#if allowanceKind !== undefined && allowanceKind !== null}
								{String((allowanceKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenId = resolvedEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							serialNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serialNumber = resolvedEntity.serialNumber}
					{#if serialNumber !== undefined && serialNumber !== null}
						<div>
							<dt>serial number</dt>
							<dd>
								{String((serialNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null && hederaToken[EntityMetaKey.Selector] != null}
						<div>
							<dt>token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nft}
			>
				{#snippet children(hederaNft)}
					{#if hederaNft != null && hederaNft[EntityMetaKey.Selector] != null}
						<div>
							<dt>NFT</dt>
							<dd>
								<HederaNftView
									selection={select(EntityType.HederaNft, hederaNft[EntityMetaKey.Selector])}
									prefetched={hederaNft}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
