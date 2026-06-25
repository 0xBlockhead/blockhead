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
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				'headHeight',
				'headTipsetKey',
				'headBlockCount',
				'headTimestampMs',
			],
			[
				'$headTipset',
				'$$headMiners',
				'networkVersion',
				{
					label: 'Lotus version/agent',
				},
				'blockDelaySeconds',
				{
					label: 'total power',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'Filecoin network identity',
					},
				],
			},
			{
				label: 'Head',
				items: [
					'headHeight',
					{
						label: 'tipset key',
					},
					{
						label: 'block count',
					},
					'headTimestampMs',
					'$headTipset',
				],
			},
			{
				label: 'Miners/power',
				items: [
					{
						label: 'head block producers',
					},
					{
						label: 'raw byte power',
					},
					{
						label: 'quality-adjusted power',
					},
				],
			},
			{
				label: 'Node',
				items: [
					'networkVersion',
					{
						label: 'Lotus version/agent',
					},
					'blockDelaySeconds',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ChainHead',
					},
					{
						label: 'StateNetworkVersion',
					},
					{
						label: 'Version',
					},
					{
						label: 'StateMinerPower',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'head-miners',
			label: 'head miners',
			field: '$$headMiners',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinNetwork_Timestamp>
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
	entityType={EntityType.FilecoinNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
