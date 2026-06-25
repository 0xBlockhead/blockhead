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
			label: 'package lineage',
		},
		'upgradedPackageId',
		'upgradedVersion',
	],
	content: {
		dl: [
			[
				{
					label: 'package lineage',
				},
				'upgradedPackageId',
				'upgradedVersion',
				'previousPackageId',
				'policy',
			],
			[
				'digest',
				'$transaction',
				'timestampMs',
				{
					label: 'upgrade capability selector',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Package',
				items: [
					{
						label: 'parent package lineage',
					},
				],
			},
			{
				label: 'Published package',
				items: [
					{
						label: 'published package version',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'upgrade transaction',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'object changes',
					},
					{
						label: 'published objects',
					},
					{
						label: 'upgrade-cap mutation payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiPackageUpgrade>
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
	entityType={EntityType.SuiPackageUpgrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
