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
		'$bigMap',
		'level',
		'source',
	],
	content: {
		dl: [
			[
				'$bigMap',
				'level',
				'source',
				'timestampMs',
				'active',
				'keyCount',
				'updateCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Big map',
				items: [
					{
						label: 'parent Tezos big map',
					},
				],
			},
			{
				label: 'Keys',
				items: [
					{
						label: 'big-map key rows',
					},
				],
			},
			{
				label: 'Updates',
				items: [
					{
						label: 'big-map diff rows',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'big-map current/history payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMap_Timestamp>
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
	entityType={EntityType.TezosBigMap_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
