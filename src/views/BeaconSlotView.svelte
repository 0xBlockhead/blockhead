<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'


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
			entityId: typeof BeaconSlotSchema.id.infer
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
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
			{
				networkId: String(entityId.$network.chainId),
				slotNumber: String(entityId.slot),
			},
		)
	)

	const title = titleProp ?? `Slot ${entityId.slot.toLocaleString()}`

	const slot = useEntity(
		EntityType.BeaconSlot,
		entityId,
		{
			$: [
				Source.Beacon_Rest,
			],
			epoch: {},
			proposerIndex: {},
			root: {},
			parentRoot: {},
			stateRoot: {},
			bodyRoot: {},
			canonical: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	{entityId}
	{title}
	{href}
	{layout}
	{open}
	idDragPlainText={String(entityId.slot)}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<ResourceBoundary resource={slot}>
				{#snippet children(s)}
					<div>
						<dt>Proposer</dt>
						<dd>
							<NumberValue value={s.proposerIndex} />
						</dd>
					</div>
					{#if open}
						<div>
							<dt>Root</dt>
							<dd>
								<TruncatedValue
									value={s.root}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Canonical</dt>
							<dd>{s.canonical ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Parent root</dt>
							<dd>
								<TruncatedValue
									value={s.parentRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue
									value={s.stateRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Body root</dt>
							<dd>
								<TruncatedValue
									value={s.bodyRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BeaconSlot}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
