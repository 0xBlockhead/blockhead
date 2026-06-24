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
			label: 'network',
		},
		{
			label: 'pallet name',
		},
		{
			label: 'pallet index',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'pallet name',
				},
				{
					label: 'pallet index',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Extrinsics',
				items: [
					{
						label: 'extrinsics by pallet when indexed',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'events by pallet when indexed',
					},
				],
			},
			{
				label: 'Runtime metadata',
				items: [
					{
						label: 'source metadata fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotPallet>
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
	entityType={EntityType.PolkadotPallet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
