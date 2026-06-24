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
			label: 'block number',
		},
		'hash',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'block number',
				},
				'hash',
				{
					label: 'parent block',
				},
				{
					label: 'state root',
				},
				{
					label: 'extrinsics root',
				},
				{
					label: 'extrinsic count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent',
				items: [
					{
						label: 'parent Subtensor/Substrate block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Bittensor network',
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorBlock>
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
	entityType={EntityType.BittensorBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
