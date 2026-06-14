<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.DogecoinBlockAuxPow>
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
	entitySelector={selector}
	title={'Dogecoin AuxPoW'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Dogecoin AuxPoW

	{/snippet}
</EntityView>
