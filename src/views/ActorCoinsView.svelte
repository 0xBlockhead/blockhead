<script lang="ts">
	// Types/constants
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	let {
		entityFieldReference,
		title = 'Balances',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof EntityType.ActorCoin>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActorCoin}
	{title}
	bind:open
	{...EntitiesListProps}
/>
