<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'slashing kind',
		},
		'slot',
	],
	content: {
		dl: [
			[
				{
					label: 'slashing kind',
				},
				'slot',
			],
			[
				{
					label: 'slashing index',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Slot',
				items: [
					{
						label: 'beacon block/body context',
					},
				],
			},
			{
				label: 'Slashing',
				items: [
					'kind',
					{
						label: 'slot-local index',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'beacon block proposer/attester slashing payload',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlashing>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BeaconSlashing}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
