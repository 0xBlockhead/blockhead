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
			entityId: EntityId<typeof schema, EntityType.DogecoinBlockAuxPow>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinBlockAuxPow}
	{entityId}
	title={'Dogecoin AuxPoW'}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Dogecoin AuxPoW
	{/snippet}

	{#snippet Heading()}
		Dogecoin AuxPoW
	{/snippet}
</EntityView>
