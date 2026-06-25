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
		'$keyImage',
		'$$members',
	],
	content: {
		dl: [
			[
				'$keyImage',
				'$$members',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Key image',
				items: [
					'$keyImage',
				],
			},
			{
				label: 'Members',
				items: [
					{
						label: 'ring member decoy rows',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Monero transaction through key image',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'members',
			label: 'members',
			field: '$$members',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MoneroRing>
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
	entityType={EntityType.MoneroRing}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
