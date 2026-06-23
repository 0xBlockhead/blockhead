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
				label: 'struct name',
			},
			'abilities',
		],
		content: {
			dl: [
				[
					{
						label: 'module',
					},
					{
						label: 'struct name',
					},
					{
						label: 'native flag',
					},
					{
						label: 'event flag',
					},
					'abilities',
					{
						label: 'type parameters',
					},
					'fields',
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
							label: 'Aptos structs payload or Sui normalized module struct payload',
						},
					],
				},
				{
					label: 'Runtime uses',
					items: [
						{
							label: 'Aptos account resources or Sui objects whose type tag resolves to this struct',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoveStruct>
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
	entityType={EntityType.MoveStruct}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
