<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BeaconValidator> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))
	const beaconValidator = $derived(viewSelection({
		fields: {
			indexInNetwork: true,
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator}
	entitySelector={selection.entitySelector}
	title={title ?? `Validator #${pendingEntity.indexInNetwork}`}
	idDragPlainText={String(pendingEntity.indexInNetwork ?? '')}
	href={
		href === undefined ?
			(
				'indexInNetwork' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							validatorId: String(selection.entitySelector.indexInNetwork),
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
	{#snippet Title()}
		<ResourceBoundary resource={beaconValidator}>
			{#snippet children(entity)}
				<span data-row="inline align-center gap-2 wrap">
					<span>Validator </span>
					<span data-badge="small">
						#{entity.indexInNetwork}
					</span>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconValidator}>
			{#snippet children(entity)}
				<span data-badge="small">
					#{entity.indexInNetwork}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconValidator}>
			{#snippet children(entity)}
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Index in network</dt>
				<dd>
					<ResourceBoundary
						resource={beaconValidator}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.indexInNetwork}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={beaconValidator}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							slashed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashed = entity.slashed}
					{#if slashed != null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{slashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							balanceGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceGwei = entity.balanceGwei}
					{#if balanceGwei != null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue
									value={balanceGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							effectiveBalanceGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const effectiveBalanceGwei = entity.effectiveBalanceGwei}
					{#if effectiveBalanceGwei != null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								<NumberValue
									value={effectiveBalanceGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									pubkey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.pubkey} />
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

	{#snippet Details()}
		<section data-column="gap-2">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							attestationDuties: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					<ResourceBoundary
						resource={
							selection({
								fields: {
									attestationDuties: true,
								},
								sources: [
									Source.BeaconchaIn_Rest,
								],
							})
						}
					>
						{#snippet children(attestationDutiesField)}
							{#if attestationDutiesField.values.length > 0}
								<section data-column="gap-2">
									<header>
										<h3>Attestation duties</h3>
									</header>

									<ul data-column="gap-2">
										{#each attestationDutiesField.values as duty, dutyIndex (dutyIndex)}
											<li data-row="wrap gap-2">
												<span>
													Epoch <NumberValue value={duty.epoch} />
												</span>

												<span data-text="muted">·</span>

												<span>
													Attester <NumberValue value={duty.attesterSlot} />
												</span>

												<span data-text="muted">·</span>

												<span>
													Inclusion <NumberValue value={duty.inclusionSlot} />
												</span>

												<span data-text="muted">·</span>

												<span>
													{
														duty.status === 1 ?
															'Included'
														: duty.status === 0 ?
															'Missed'
														:
															duty.status
													}
												</span>

												{#if duty.committeeIndex != null}
													<span data-text="muted">·</span>

													<span>
														Committee <NumberValue value={duty.committeeIndex} />
													</span>
												{/if}
											</li>
										{/each}
									</ul>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
