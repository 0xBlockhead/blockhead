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
			label: 'AVS address',
		},
		'name',
		{
			label: 'latest operator count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'AVS address',
				},
				'name',
				'website',
				{
					label: 'metadata URI',
				},
				{
					label: 'latest operator/strategy counts',
				},
			],
			[
				{
					label: 'network',
				},
				{
					label: 'AVS account',
				},
				{
					label: 'latest allocation/slashing activity',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped AVS aggregate observations',
					},
				],
			},
			{
				label: 'Operators',
				items: [
					{
						label: 'EigenLayer operators filtered by AVS',
					},
				],
			},
			{
				label: 'Allocations',
				items: [
					{
						label: 'allocation observations grouped by operator/strategy',
					},
				],
			},
			{
				label: 'Slashing',
				items: [
					{
						label: 'EigenLayer slashing events',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'metadata URI payload',
					},
					{
						label: 'display fields',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'AVS and middleware EVM contracts when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'AVSDirectory registration',
					},
					{
						label: 'metadata fetch/indexer payload',
					},
					{
						label: 'event logs',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerAvs>
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
	entityType={EntityType.EigenLayerAvs}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
