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
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandApplicationLocalState_Round>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const application = $derived(selection.entitySelector.$application)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandApplicationLocalState_Round}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'caip2' in application.$network.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/application/[applicationNetwork=networkCaip2]/[applicationId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
						{
							network: (
								'caip2' in account.$network.$network ?
									caip2StringFromValue(account.$network.$network.caip2)
								:
									account.$network.$network.slug
							),
							address: account.address,
							applicationNetwork: String(application.$network.$network.caip2),
							applicationId: String(application.applicationId),
							round: String(selection.entitySelector.round),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
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
				<dt>account</dt>
				<dd>
					<AlgorandAccountView
						selection={select(EntityType.AlgorandAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
				<dt>round</dt>
				<dd>
					{selection.entitySelector.round}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
