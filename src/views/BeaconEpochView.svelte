<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
			{
				networkId: String(entityId.$network.chainId),
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
			],
			startSlot: {},
			endSlot: {},
			...(open && {
				slotCount: {},
			}),
		},
	)


	// (Derived)
	const title = $derived(
		titleProp ?? `Epoch ${entityId.epoch.toLocaleString()}`,
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
	{#snippet Heading()}
		<span>
			{entityId.epoch}
		</span>
	{/snippet}

	{#snippet Value()}
		<span
			data-badge="small"
			data-epoch-number={String(entityId.epoch)}
		>
			{String(entityId.epoch)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Epoch </span>
			<span
				data-badge="small"
				data-epoch-number={String(entityId.epoch)}
			>
				{String(entityId.epoch)}
			</span>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Consensus slot range</dt>
				<dd>
					<ResourceBoundary
						resource={epoch}
						placeholderText="Loading epoch…"
					>
						{#snippet children(loadedEpoch)}
							{#if (
								loadedEpoch.startSlot !== undefined
								&& loadedEpoch.endSlot !== undefined
							)}
								<NumberValue value={loadedEpoch.startSlot} />
								to
								<NumberValue value={loadedEpoch.endSlot} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Slots in this epoch</dt>
					<dd>
						<ResourceBoundary
							resource={epoch}
							placeholderText="Loading epoch…"
						>
							{#snippet children(loadedEpoch)}
								{#if loadedEpoch.slotCount !== undefined}
									<NumberValue value={loadedEpoch.slotCount} />
								{:else}
									<span data-text="muted">Slot span unavailable from beacon API.</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BeaconEpoch}
			{entityId}
		/>
		<div
			class="beacon-epoch-view-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${epochIdKey}:carousel-slots`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Slots</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Slots"
						href={`#${epochIdKey}:beacon-slots`}
					>Slots</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section>
						<BeaconSlotsView
							entityFieldReference={{
								entityType: EntityType.BeaconEpoch,
								entityId,
								fieldName: '$$beaconSlots',
							}}
							id={`${epochIdKey}:beacon-slots`}
							title="Slots"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
