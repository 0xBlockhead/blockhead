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
				label: 'migration',
			},
			{
				label: 'observation time',
			},
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'migration',
					},
					{
						label: 'observation time',
					},
					'source',
					'status',
					{
						label: 'source observed time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Migration',
					items: [
						{
							label: 'parent token migration',
						},
					],
				},
				{
					label: 'Token',
					items: [
						{
							label: 'source BNB Beacon token',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'fusion status payload',
						},
						{
							label: 'archive/indexer freshness',
						},
						{
							label: 'target-chain confirmation evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTokenMigration_Timestamp>
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
	entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
