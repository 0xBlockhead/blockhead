<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmCalldata> = $props()


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.hex || 'EVM calldata')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]',
				{
					hex: selection.entitySelector.hex,
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
		<TruncatedValue value={selection.entitySelector.hex} />
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">{selection.entitySelector.hex}</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Call/input data</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hex} />
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
