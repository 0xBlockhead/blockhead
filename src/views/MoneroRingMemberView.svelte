<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MoneroRingMember>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const moneroRingMember = useEntity(
		EntityType.MoneroRingMember,
		entityId,
		{
			globalOutputIndex: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRingMember}
	{entityId}
	title={`Monero Ring Member ${entityId.memberIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.memberIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={moneroRingMember}
			placeholderText={`Loading Monero Ring Member...`}
		>
			{#snippet children(moneroRingMember)}
				<dl>
					{#if moneroRingMember.globalOutputIndex != null}
						<div>
							<dt>Global Output Index</dt>
							<dd><NumberValue value={moneroRingMember.globalOutputIndex} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
