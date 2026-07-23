<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.BittensorNeuron>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BittensorNeuron>
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
	const bittensorNeuron = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.uid) ?? '')].filter(Boolean).join(' ') || 'Bittensor neuron')
	const viewDomId = $derived('bittensor-neuron-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$subnet') && prefetched.$subnet != null && Object.hasOwn(prefetched.$subnet, 'name')}
			{@const uid0 = pendingEntity.uid}
			{#if uid0 !== undefined && uid0 !== null}
				<NumberValue
					value={uid0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={bittensorNeuron}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uid0 = resolvedEntity.uid}
					{#if uid0 !== undefined && uid0 !== null}
						<NumberValue
							value={uid0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$subnet') && prefetched.$subnet != null && Object.hasOwn(prefetched.$subnet, 'name')}
			{@const bittensorSubnet0 = pendingEntity.$subnet}
			{#if bittensorSubnet0 != null && selection.entitySelector.$subnet != null}
				<BittensorSubnetView
					selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet, { sources: selection.sources })}
					prefetched={bittensorSubnet0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={bittensorNeuron}>
				{#snippet children(entity)}
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
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
								sources: selection.sources,
								fields: {
									uid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uid = resolvedEntity.uid}
							{#if uid !== undefined && uid !== null}
								<NumberValue
									value={uid}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
