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
		'$box',
		'round',
		'source',
	],
	content: {
		dl: [
			[
				'$box',
				'round',
				'source',
				'valueHash',
				'deleted',
				{
					label: 'raw value availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Box',
				items: [
					{
						label: 'parent application box identity',
					},
				],
			},
			{
				label: 'Application',
				items: [
					{
						label: 'application reached through the box',
					},
				],
			},
			{
				label: 'Value',
				items: [
					{
						label: 'raw value when fetched',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'algod application box by name',
					},
					{
						label: 'indexer application boxes/history payload when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandBox_Round>
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
	entityType={EntityType.AlgorandBox_Round}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
