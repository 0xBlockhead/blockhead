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
			label: 'room',
		},
		{
			label: 'peer id',
		},
		{
			label: 'network',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'room',
				},
				{
					label: 'peer id',
				},
				{
					label: 'network',
				},
				{
					label: 'account',
				},
				{
					label: 'target peer ids',
				},
				{
					label: 'shared time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Room',
				items: [
					{
						label: 'parent local room',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'shared EVM account on the selected network',
					},
				],
			},
			{
				label: 'Authentication',
				items: [
					{
						label: 'linked SIWE challenge rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSharedAddress>
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
	entityType={EntityType.BlockheadSharedAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
