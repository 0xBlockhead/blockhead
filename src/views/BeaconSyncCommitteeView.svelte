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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconSyncCommittee>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSyncCommittee}
	entitySelector={selection.entitySelector}
	title={title ?? `Sync committee #${selection.entitySelector.period}`}
	idDragPlainText={String(selection.entitySelector.period)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					period: String(selection.entitySelector.period),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Sync committee </span>
			<span data-badge="small">
				#{selection.entitySelector.period}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.period}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Period</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.period}
					/>
				</dd>
			</div>

			<div>
				<dt>Validator indices</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									validatorIndices: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.validatorIndices.join(', ')}
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
