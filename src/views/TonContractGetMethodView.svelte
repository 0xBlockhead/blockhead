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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TonContractGetMethod>, 'prefetched'> = $props()


	// Components
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TonContractGetMethod}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON contract get method'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<TonContractView
						selection={select(EntityType.TonContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>method name</dt>
				<dd>
					{selection.entitySelector.methodName}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
