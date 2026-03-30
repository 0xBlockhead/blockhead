<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	let {
		title = 'Contacts',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
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
	entityType={EntityType.BlockheadRoomPeer}
	{title}
	bind:open
	{...EntitiesListProps}
/>
