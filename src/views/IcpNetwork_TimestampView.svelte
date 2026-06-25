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
		{
			label: 'observed time/source',
		},
		'registryVersion',
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'observed time/source',
				},
				'registryVersion',
				'subnetCount',
				'canisterCount',
				'boundaryNodeCount',
				'rootKeyHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent ICP network',
					},
				],
			},
			{
				label: 'Registry aggregate',
				items: [
					'registryVersion',
					{
						label: 'subnet/canister counts',
					},
				],
			},
			{
				label: 'Boundary nodes',
				items: [
					'boundaryNodeCount',
					{
						label: 'domain evidence',
					},
				],
			},
			{
				label: 'Root key',
				items: [
					'rootKeyHash',
					{
						label: 'certification context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw registry/status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpNetwork_Timestamp>
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
	entityType={EntityType.IcpNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
