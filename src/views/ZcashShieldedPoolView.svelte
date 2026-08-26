<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZcashShieldedPool>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const zcashShieldedPool = $derived(selection({
		fields: {
			noteProtocol: true,
			activationNetworkUpgrade: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.pool || 'Zcash shielded pool')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					pool: selection.entitySelector.pool,
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
		<ResourceBoundary resource={zcashShieldedPool}>
			{#snippet children(entity)}
				{entity.noteProtocol || selection.entitySelector.pool || titleFallback}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					{selection.entitySelector.pool}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
