<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'

	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href: hrefProp,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: typeof BeaconEpochSchema.id.infer
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	const href = (
		hrefProp ?? resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
			{
				networkId: String(entityId.$network.chainId),
				epochNumber: String(entityId.epoch),
			},
		)
	)

	const title = titleProp ?? `Epoch ${entityId.epoch.toLocaleString()}`

	const epochIdKey = $derived(
		stringify(entityId),
	)

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
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	{title}
	{href}
	{layout}
	bind:open
	idDragPlainText={String(entityId.epoch)}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.epoch}
		</span>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Execution layer chain</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<ResourceBoundary
				resource={epoch}
				placeholderText="Loading epoch…"
			>
				{#snippet children(e)}
					{#if e.startSlot !== undefined}
						{#if e.endSlot !== undefined}
							<div>
								<dt>Consensus slot range</dt>
								<dd>
									<NumberValue value={e.startSlot} />
									to
									<NumberValue value={e.endSlot} />
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if e.slotCount !== undefined}
							<div>
								<dt>Slots in this epoch</dt>
								<dd>
									<NumberValue value={e.slotCount} />
								</dd>
							</div>
						{:else}
							<div>
								<dt>Slots in this epoch</dt>
								<dd data-text="muted">Slot span unavailable from beacon API.</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
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

				{#snippet children(_childrenContext)}
					<section>
						<BeaconSlotsView
							entityFieldReference={{
								entityType: EntityType.BeaconEpoch,
								entityId,
								fieldName: '$$beaconSlots',
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/beacon-slots',
								{
									networkId: String(entityId.$network.chainId),
								},
							)}
							id={`${epochIdKey}:beacon-slots`}
							open={false}
							title="Slots"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
