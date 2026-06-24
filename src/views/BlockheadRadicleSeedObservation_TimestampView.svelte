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
			label: 'repository',
		},
		{
			label: 'seed node id',
		},
		{
			label: 'observer node',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'repository',
				},
				{
					label: 'seed node id',
				},
				{
					label: 'observer node',
				},
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'advertised flag',
				},
				{
					label: 'reachable flag',
				},
				{
					label: 'ref count',
				},
				{
					label: 'object count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Radicle repository',
					},
				],
			},
			{
				label: 'Observer node',
				items: [
					{
						label: 'observer Radicle node state',
					},
				],
			},
			{
				label: 'Fetch evidence',
				items: [
					{
						label: 'sync session or Git fetch observation rows when linked',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'connected-node inventory/fetch payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleSeedObservation_Timestamp>
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
	entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
