<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconEpoch>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	entitySelector={selection.entitySelector}
	title={title ?? `Epoch #${selection.entitySelector.epoch}`}
	idDragPlainText={String(selection.entitySelector.epoch)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					epoch: String(selection.entitySelector.epoch),
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
			<span>Epoch </span>
			<span data-badge="small">
				#{selection.entitySelector.epoch}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.epoch}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Start slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									startSlot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.startSlot}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>End slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									endSlot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.endSlot}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Slot count</dt>
					<dd>
						<ResourceBoundary
							resource={
								viewSelection({
									fields: {
										slotCount: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								<NumberValue
									value={entity.slotCount}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								finalized: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const finalized = entity.finalized}
						{#if finalized != null}
							<div>
								<dt>Finalized</dt>
								<dd>
									{finalized ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								globalParticipationRate: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const globalParticipationRate = entity.globalParticipationRate}
						{#if globalParticipationRate != null}
							<div>
								<dt>Participation</dt>
								<dd>
									<NumberValue
										value={Number(globalParticipationRate)}
										options={{ style: 'percent' }}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								validatorsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const validatorsCount = entity.validatorsCount}
						{#if validatorsCount != null}
							<div>
								<dt>Validators</dt>
								<dd>
									<NumberValue
										value={validatorsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								attestationsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const attestationsCount = entity.attestationsCount}
						{#if attestationsCount != null}
							<div>
								<dt>Attestations</dt>
								<dd>
									<NumberValue
										value={attestationsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								withdrawalsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const withdrawalsCount = entity.withdrawalsCount}
						{#if withdrawalsCount != null}
							<div>
								<dt>Withdrawals</dt>
								<dd>
									<NumberValue
										value={withdrawalsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								attesterSlashingsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const attesterSlashingsCount = entity.attesterSlashingsCount}
						{#if attesterSlashingsCount != null}
							<div>
								<dt>Attester slashings</dt>
								<dd>
									<NumberValue
										value={attesterSlashingsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								proposerSlashingsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const proposerSlashingsCount = entity.proposerSlashingsCount}
						{#if proposerSlashingsCount != null}
							<div>
								<dt>Proposer slashings</dt>
								<dd>
									<NumberValue
										value={proposerSlashingsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const beaconSlotsResource = selection
			.$$beaconSlots({
				sources: [
					Source.Beacon_Rest,
					Source.BeaconchaIn_Rest,
				],
				limit: 32,
			})}
		<ResourceBoundary
			resource={beaconSlotsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconSlotsView
						selection={beaconSlotsResource}
						countResource={beaconSlotsResource.count}
						title='Slots'
						id='beacon-slots'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
