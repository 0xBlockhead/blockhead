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
		'$bigMapKey',
		'level',
		'source',
	],
	content: {
		dl: [
			[
				'$bigMapKey',
				'level',
				'source',
				'timestampMs',
				{
					label: 'decoded key',
				},
			],
			[
				{
					label: 'decoded value',
				},
				{
					label: 'first/last level',
				},
				'updateCount',
				'active',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Key',
				items: [
					{
						label: 'parent Tezos big-map key',
					},
				],
			},
			{
				label: 'Big map',
				items: [
					{
						label: 'parent Tezos big map',
					},
				],
			},
			{
				label: 'Updates',
				items: [
					{
						label: 'big-map diffs near this level',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'current key lookup',
					},
					{
						label: 'historical context storage query',
					},
					{
						label: 'indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMapKey_Timestamp>
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
	entityType={EntityType.TezosBigMapKey_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
