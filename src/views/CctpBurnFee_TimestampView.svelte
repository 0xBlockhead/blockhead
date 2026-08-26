<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpBurnFee_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctpIris,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpBurnFee_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<CctpDomainSupportView
			selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$sourceDomain)}
			href={null}
			layout={EntityLayout.Value}
		/>

		<CctpDomainSupportView
			selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$destinationDomain)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Source domain</dt>
				<dd>
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$sourceDomain)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Destination domain</dt>
				<dd>
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$destinationDomain)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
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
			<div>
				<dt>Forward</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									forward: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.forward ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							hyperCoreDeposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hyperCoreDeposit = entity.hyperCoreDeposit}
					{#if hyperCoreDeposit != null}
						<div>
							<dt>HyperCore deposit</dt>
							<dd>
								{hyperCoreDeposit ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
