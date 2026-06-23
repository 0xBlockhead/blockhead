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
				label: 'original package id',
			},
			{
				label: 'latest package id/version/digest summary',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'original package id',
					},
					{
						label: 'latest package id/version/digest summary',
					},
					{
						label: 'version count',
					},
					{
						label: 'upgrade count',
					},
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
