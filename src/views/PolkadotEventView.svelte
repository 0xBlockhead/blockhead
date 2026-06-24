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
			label: 'block',
		},
		{
			label: 'event index',
		},
		{
			label: 'pallet',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'block',
				},
				{
					label: 'event index',
				},
				{
					label: 'pallet',
				},
				{
					label: 'event name',
				},
				{
					label: 'linked extrinsic when present',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Extrinsic',
				items: [
					{
						label: 'linked Polkadot extrinsic',
					},
				],
			},
			{
				label: 'Pallet',
				items: [
					{
						label: 'runtime pallet',
					},
				],
			},
			{
				label: 'Block context',
				items: [
					{
						label: 'parent Polkadot block',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotEvent>
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
	entityType={EntityType.PolkadotEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
