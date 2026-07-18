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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.ZcashShieldedPoolBlockState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZcashShieldedPoolBlockState>>
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
	const zcashShieldedPoolBlockState = $derived(selection({
		sources: selection.sources,
		fields: {
			saplingTree: true,
			orchardTree: true,
		},
	}))
	const titleFallback = $derived('zcash shielded pool block state')
	const viewDomId = $derived('zcash-shielded-pool-block-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPoolBlockState}
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
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
						href={
						(selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
							pool: String(selection.entitySelector.$pool.pool ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$pool.$network.caip2) ?? ''),
						}) : selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
							pool: String(selection.entitySelector.$pool.pool ?? ''),
							network: String(selection.entitySelector.$pool.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={zcashShieldedPoolBlockState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
						href={
						(selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
							pool: String(selection.entitySelector.$pool.pool ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$pool.$network.caip2) ?? ''),
						}) : selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
							pool: String(selection.entitySelector.$pool.pool ?? ''),
							network: String(selection.entitySelector.$pool.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[pendingEntity.saplingTree == null ? '' : String((`${(pendingEntity.saplingTree).finalRoot} / ${(pendingEntity.saplingTree).finalState}`) ?? ''), pendingEntity.orchardTree == null ? '' : String((`${(pendingEntity.orchardTree).finalRoot} / ${(pendingEntity.orchardTree).finalState}`) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={zcashShieldedPoolBlockState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[resolvedEntity.saplingTree == null ? '' : String((`${(resolvedEntity.saplingTree).finalRoot} / ${(resolvedEntity.saplingTree).finalState}`) ?? ''), resolvedEntity.orchardTree == null ? '' : String((`${(resolvedEntity.orchardTree).finalRoot} / ${(resolvedEntity.orchardTree).finalState}`) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
							}) : selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>pool</dt>
				<dd>
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool, {})}
						href={
							(selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
								pool: String(selection.entitySelector.$pool.pool ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$pool.$network.caip2) ?? ''),
							}) : selection.entitySelector.$pool.pool !== undefined && selection.entitySelector.$pool.$network !== undefined && selection.entitySelector.$pool.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
								pool: String(selection.entitySelector.$pool.pool ?? ''),
								network: String(selection.entitySelector.$pool.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							saplingTree: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const saplingTree = resolvedEntity.saplingTree}
					{#if saplingTree !== undefined && saplingTree !== null}
						<div>
							<dt>Sapling tree</dt>
							<dd>
								{saplingTree == null ? '' : String((`${(saplingTree).finalRoot} / ${(saplingTree).finalState}`) ?? '')}
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
							orchardTree: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orchardTree = resolvedEntity.orchardTree}
					{#if orchardTree !== undefined && orchardTree !== null}
						<div>
							<dt>Orchard tree</dt>
							<dd>
								{orchardTree == null ? '' : String((`${(orchardTree).finalRoot} / ${(orchardTree).finalState}`) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
