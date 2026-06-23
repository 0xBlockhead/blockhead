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
			{
				label: 'latest height',
			},
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
						label: 'latest height/hash',
					},
					{
						label: 'latest block time',
					},
					{
						label: 'syncing/health',
					},
				],
				[
					{
						label: 'blob count',
					},
					{
						label: 'namespace count',
					},
					{
						label: 'sampled header height',
					},
					{
						label: 'node type',
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
							label: 'parent Celestia network',
						},
					],
				},
				{
					label: 'Latest block',
					items: [
						{
							label: 'latest Celestia block when resolved',
						},
					],
				},
				{
					label: 'DA sampling',
					items: [
						{
							label: 'sampled header height',
						},
						{
							label: 'node type/source freshness',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node header/status APIs',
						},
						{
							label: 'CometBFT status',
						},
						{
							label: 'Cosmos SDK node info',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNetwork_Timestamp>
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
	entityType={EntityType.CelestiaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
