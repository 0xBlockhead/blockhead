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
				label: 'module',
			},
			{
				label: 'function name',
			},
			'visibility',
		],
		content: {
			dl: [
				[
					{
						label: 'module',
					},
					{
						label: 'function name',
					},
					'visibility',
					{
						label: 'entry flag',
					},
					{
						label: 'view flag',
					},
					{
						label: 'type parameters',
					},
					'parameters',
					{
						label: 'returns',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Module',
					items: [
						{
							label: 'parent Move module',
						},
					],
				},
				{
					label: 'ABI evidence',
					items: [
						{
							label: 'Aptos exposed_functions or Sui normalized module function payload',
						},
					],
				},
				{
					label: 'Call sites',
					items: [
						{
							label: 'Aptos transaction payloads or Sui programmable-transaction commands when indexed',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoveFunction>
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
	entityType={EntityType.MoveFunction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
