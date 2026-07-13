<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPool>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZcashShieldedPool>>
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
	const zcashShieldedPool = $derived(selection({
		fields: {
			noteProtocol: true,
			activationNetworkUpgrade: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool')
	const viewDomId = $derived('zcash-shielded-pool-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.pool !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			pool: String(pendingEntity.pool ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet Pending()}
				{[String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet Pending()}
				{[String((pendingEntity.noteProtocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.noteProtocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet Pending()}
				{@const activationNetworkUpgrade0 = pendingEntity.activationNetworkUpgrade}
				{#if activationNetworkUpgrade0 !== undefined && activationNetworkUpgrade0 !== null}
					<span data-text="muted">
						{String((activationNetworkUpgrade0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const activationNetworkUpgrade0 = resolvedEntity.activationNetworkUpgrade}
				{#if activationNetworkUpgrade0 !== undefined && activationNetworkUpgrade0 !== null}
					<span data-text="muted">
						{String((activationNetworkUpgrade0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pool: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pool = pendingEntity.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pool = resolvedEntity.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							noteProtocol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const noteProtocol = pendingEntity.noteProtocol}
					{#if noteProtocol !== undefined && noteProtocol !== null}
						<div>
							<dt>Note protocol</dt>
							<dd>
								{String((noteProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noteProtocol = resolvedEntity.noteProtocol}
					{#if noteProtocol !== undefined && noteProtocol !== null}
						<div>
							<dt>Note protocol</dt>
							<dd>
								{String((noteProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationNetworkUpgrade: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationNetworkUpgrade = pendingEntity.activationNetworkUpgrade}
					{#if activationNetworkUpgrade !== undefined && activationNetworkUpgrade !== null}
						<div>
							<dt>Activation network upgrade</dt>
							<dd>
								{String((activationNetworkUpgrade) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationNetworkUpgrade = resolvedEntity.activationNetworkUpgrade}
					{#if activationNetworkUpgrade !== undefined && activationNetworkUpgrade !== null}
						<div>
							<dt>Activation network upgrade</dt>
							<dd>
								{String((activationNetworkUpgrade) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
