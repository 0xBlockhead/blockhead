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
		'$network',
		'originalPackageId',
		{
			label: 'latest package id/version/digest summary',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'originalPackageId',
				{
					label: 'latest package id/version/digest summary',
				},
				'$$versions',
				'$$upgrades',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Versions',
				items: [
					{
						label: 'package version rows',
					},
				],
			},
			{
				label: 'Upgrades',
				items: [
					{
						label: 'package upgrade edges',
					},
				],
			},
			{
				label: 'Modules',
				items: [
					{
						label: 'Move modules grouped by package version',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Sui network',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'versions',
			label: 'versions',
			field: '$$versions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'upgrades',
			label: 'upgrades',
			field: '$$upgrades',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiPackage>
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
	entityType={EntityType.SuiPackage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
