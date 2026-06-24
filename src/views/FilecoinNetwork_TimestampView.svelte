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
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'head height',
				},
				{
					label: 'head tipset key',
				},
				{
					label: 'head block count',
				},
				{
					label: 'head timestamp',
				},
			],
			[
				{
					label: 'head tipset',
				},
				{
					label: 'head miners',
				},
				{
					label: 'network version',
				},
				{
					label: 'Lotus version/agent',
				},
				{
					label: 'block delay',
				},
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
					{
						label: 'head height',
					},
					{
						label: 'tipset key',
					},
					{
						label: 'block count',
					},
					{
						label: 'head timestamp',
					},
					{
						label: 'head tipset',
					},
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
					{
						label: 'network version',
					},
					{
						label: 'Lotus version/agent',
					},
					{
						label: 'block delay',
					},
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
