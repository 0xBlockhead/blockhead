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
			label: 'miner address',
		},
		{
			label: 'owner actor',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'miner address',
				},
				{
					label: 'owner actor',
				},
				{
					label: 'worker actor',
				},
				{
					label: 'peer id',
				},
			],
			[
				{
					label: 'quality-adjusted power',
				},
				{
					label: 'sector count',
				},
				{
					label: 'deal count',
				},
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped miner state observations',
					},
				],
			},
			{
				label: 'Sectors',
				items: [
					{
						label: 'Filecoin sectors',
					},
				],
			},
			{
				label: 'Deals',
				items: [
					{
						label: 'Filecoin deals when provider indexes are available',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner Filecoin actor',
					},
				],
			},
			{
				label: 'Worker',
				items: [
					{
						label: 'worker Filecoin actor',
					},
				],
			},
			{
				label: 'Produced blocks',
				items: [
					{
						label: 'Filecoin blocks when source context provides block membership',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMiner>
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
	entityType={EntityType.FilecoinMiner}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
