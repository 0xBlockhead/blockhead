<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BittensorNeuron> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.uid)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.uid}
		/>
	{/snippet}

	{#snippet Value()}
		<BittensorSubnetView
			selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Subnet</dt>
				<dd>
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>UID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.uid}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
