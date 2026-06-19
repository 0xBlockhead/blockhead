<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinBlockAuxPow>
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
	entitySelector={selection.entitySelector}
	title={'Dogecoin AuxPoW'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Dogecoin AuxPoW

	{/snippet}
</EntityView>
