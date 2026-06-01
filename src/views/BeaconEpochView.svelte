<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(beacon-epochs)/epoch/[epochNumber]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
				epochNumber: String(entityId.epoch),
			},
		),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: typeof BeaconEpochSchema.id.infer
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const epoch = useEntity(
		EntityType.BeaconEpoch,
		entityId,
		{
			$: [
				Source.Beacon_Rest,
				Source.BeaconchaIn_Rest,
			],
			startSlot: {},
			endSlot: {},
			...(open && {
				slotCount: {},
				finalized: {},
				globalParticipationRate: {},
				validatorsCount: {},
				attestationsCount: {},
				attesterSlashingsCount: {},
				proposerSlashingsCount: {},
				withdrawalsCount: {},
			}),
		},
	)


	const title = $derived(
		titleProp ?? `Epoch #${entityId.epoch.toLocaleString()}`,
	)

	const epochIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(entityId.epoch)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(entityId.epoch)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Epoch </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Slot range</dt>
				<dd>
					<ResourceBoundary
						resource={epoch}
						placeholderText="Loading epoch…"
					>
						{#snippet children(epoch)}
							{#if (
								epoch.startSlot !== undefined
								&& epoch.endSlot !== undefined
							)}
								<NumberValue value={epoch.startSlot} />
								to
								<NumberValue value={epoch.endSlot} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Slot count</dt>
					<dd>
						<ResourceBoundary
							resource={epoch}
							placeholderText="Loading epoch…"
						>
							{#snippet children(epoch)}
								{#if epoch.slotCount !== undefined}
									<NumberValue value={epoch.slotCount} />
								{:else}
									<span data-text="muted">Slot span unavailable from beacon API.</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				{#if epoch.finalized !== undefined}
					<div>
						<dt>Finalized</dt>
						<dd>{epoch.finalized ? 'Yes' : 'No'}</dd>
					</div>
				{/if}

				{#if epoch.globalParticipationRate !== undefined}
					<div>
						<dt>Participation</dt>
						<dd>{(epoch.globalParticipationRate * 100).toFixed(2)}%</dd>
					</div>
				{/if}

				{#if epoch.validatorsCount !== undefined}
					<div>
						<dt>Validators</dt>
						<dd><NumberValue value={epoch.validatorsCount} /></dd>
					</div>
				{/if}

				{#if epoch.attestationsCount !== undefined}
					<div>
						<dt>Attestations</dt>
						<dd><NumberValue value={epoch.attestationsCount} /></dd>
					</div>
				{/if}

				{#if epoch.withdrawalsCount !== undefined}
					<div>
						<dt>Withdrawals</dt>
						<dd><NumberValue value={epoch.withdrawalsCount} /></dd>
					</div>
				{/if}

				{#if (
					epoch.attesterSlashingsCount !== undefined
					|| epoch.proposerSlashingsCount !== undefined
				)}
					<div>
						<dt>Slashings</dt>
						<dd>
							{#if epoch.attesterSlashingsCount !== undefined}
								<NumberValue value={epoch.attesterSlashingsCount} /> attester
							{/if}
							{#if epoch.proposerSlashingsCount !== undefined}
								<NumberValue value={epoch.proposerSlashingsCount} /> proposer
							{/if}
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				id={`${epochIdKey}:carousel-slots`}
				sectionIdPrefix={epochIdKey}
				sections={[
					{ id: 'beacon-slots', label: 'Slots' },
				]}
				data-card
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Slots</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBeaconSlots()}
					<BeaconSlotsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.BeaconEpoch,
							entityId,
							fieldName: '$$beaconSlots',
						}}
						title="Slots"
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
