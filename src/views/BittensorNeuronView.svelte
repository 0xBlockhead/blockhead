<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BittensorNeuron>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BittensorNeuron>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const bittensorNeuron = $derived(selection({
		sources: [
			Source.Bittensor_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.uid ?? prefetched.uid) ?? '')].filter(Boolean).join(' ') || 'Bittensor neuron')
	const viewDomId = $derived('bittensor-neuron-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bittensorNeuron}>
			{#snippet Pending()}
				{@const uid0 = selection.entitySelector.uid ?? prefetched.uid}
				{#if uid0 !== undefined && uid0 !== null}
					<NumberValue value={Number(uid0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const uid0 = resolvedEntity.uid}
				{#if uid0 !== undefined && uid0 !== null}
					<NumberValue value={Number(uid0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bittensorNeuron}>
			{#snippet Pending()}
				<BittensorSubnetView
					selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<BittensorSubnetView
					selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Subnet</dt>
				<dd>
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>UID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									uid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const uid = selection.entitySelector.uid ?? prefetched.uid}
							{#if uid !== undefined && uid !== null}
								<NumberValue value={Number(uid)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uid = resolvedEntity.uid}
							{#if uid !== undefined && uid !== null}
								<NumberValue value={Number(uid)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
