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
			label: 'timestamp',
		},
		'source',
		'height',
	],
	content: {
		dl: [
			[
				{
					label: 'timestamp',
				},
				'source',
				'height',
				{
					label: 'target height',
				},
				{
					label: 'block hash',
				},
				{
					label: 'sync status',
				},
				{
					label: 'txpool size',
				},
				{
					label: 'peer counts',
				},
				'difficulty',
				'version',
				'status',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Head',
				items: [
					{
						label: 'height/hash/target',
					},
				],
			},
			{
				label: 'Difficulty',
				items: [
					'difficulty',
					{
						label: 'cumulative difficulty fields',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'block size/weight limits',
					},
					{
						label: 'medians',
					},
				],
			},
			{
				label: 'Peers/mempool',
				items: [
					{
						label: 'grey/white peer counts',
					},
					{
						label: 'connections',
					},
					{
						label: 'txpool size',
					},
					{
						label: 'tx count',
					},
				],
			},
			{
				label: 'Daemon',
				items: [
					'nettype',
					'mainnet',
					{
						label: 'offline/synchronized/bootstrap/version/status',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'get_info payload',
					},
					{
						label: 'RPC endpoint freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroNetwork_Timestamp>
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
	entityType={EntityType.MoneroNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
