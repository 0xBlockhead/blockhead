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
		'$operation',
		'bigMapId',
		'keyHash',
	],
	content: {
		dl: [
			[
				'$operation',
				'bigMapId',
				'keyHash',
				'action',
				'$bigMap',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operation',
				items: [
					{
						label: 'parent Tezos operation',
					},
				],
			},
			{
				label: 'Big map',
				items: [
					{
						label: 'linked Tezos big map',
					},
				],
			},
			{
				label: 'Key/value',
				items: [
					{
						label: 'decoded key',
					},
					{
						label: 'value payload',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw diff payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMapDiff>
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
	entityType={EntityType.TezosBigMapDiff}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
