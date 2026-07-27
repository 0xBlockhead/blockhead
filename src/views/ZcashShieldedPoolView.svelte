<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.ZcashShieldedPool> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const zcashShieldedPool = $derived(selection({
		fields: {
			noteProtocol: true,
			activationNetworkUpgrade: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.pool ?? '') || 'Zcash shielded pool')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				pool: String(selection.entitySelector.pool),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.pool ?? '') || 'Zcash shielded pool'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet children(entity)}
				{entity.noteProtocol || pendingEntity.pool || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.activationNetworkUpgrade}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					{pendingEntity.pool}
				</dd>
			</div>

			<div>
				<dt>Note protocol</dt>
				<dd>
					<ResourceBoundary
						resource={zcashShieldedPool}
					>
						{#snippet children(entity)}
							{entity.noteProtocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Activation network upgrade</dt>
				<dd>
					<ResourceBoundary
						resource={zcashShieldedPool}
					>
						{#snippet children(entity)}
							{entity.activationNetworkUpgrade}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
