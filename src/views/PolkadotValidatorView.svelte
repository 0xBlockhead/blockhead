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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotValidator>>
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
	const polkadotValidator = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.stashAccountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot validator')
	const viewDomId = $derived('polkadot-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotValidator}>
			{#snippet Pending()}
				{@const stashAccountId0 = pendingEntity.stashAccountId}
				{#if stashAccountId0 !== undefined && stashAccountId0 !== null}
					<TruncatedValue value={String((stashAccountId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const stashAccountId0 = resolvedEntity.stashAccountId}
				{#if stashAccountId0 !== undefined && stashAccountId0 !== null}
					<TruncatedValue value={String((stashAccountId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotValidator}>
			{#snippet Pending()}
				{@const stashAccountId0 = pendingEntity.stashAccountId}
				{#if stashAccountId0 !== undefined && stashAccountId0 !== null}
					<TruncatedValue value={String((stashAccountId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const stashAccountId0 = resolvedEntity.stashAccountId}
				{#if stashAccountId0 !== undefined && stashAccountId0 !== null}
					<TruncatedValue value={String((stashAccountId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotValidator}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Stash account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									stashAccountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const stashAccountId = pendingEntity.stashAccountId}
							{#if stashAccountId !== undefined && stashAccountId !== null}
								<TruncatedValue value={String((stashAccountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const stashAccountId = resolvedEntity.stashAccountId}
							{#if stashAccountId !== undefined && stashAccountId !== null}
								<TruncatedValue value={String((stashAccountId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
