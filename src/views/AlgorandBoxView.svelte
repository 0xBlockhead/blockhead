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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandBox>, 'prefetched'> = $props()

	const application = $derived(selection.entitySelector.$application)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandBox_RoundsView from '$/views/AlgorandBox_RoundsView.svelte'
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandBox}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/box/[boxName=zeroExHex]',
				{
					network: (
						'caip2' in application.$network.$network ?
							caip2StringFromValue(application.$network.$network.caip2)
						:
							application.$network.$network.slug
					),
					applicationId: String(application.applicationId),
					boxName: selection.entitySelector.boxName,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>application</dt>
				<dd>
					<AlgorandApplicationView
						selection={select(EntityType.AlgorandApplication, selection.entitySelector.$application)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>box name</dt>
				<dd>
					{selection.entitySelector.boxName}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const roundsResource = selection.$$rounds}
		<ResourceBoundary
			resource={roundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandBox_RoundsView
						selection={roundsResource}
						countResource={roundsResource.count}
						title='rounds'
						id='rounds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
