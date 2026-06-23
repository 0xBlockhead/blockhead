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
				label: 'head tipset',
			},
			{
				label: 'environment',
			},
			{
				label: 'RPC endpoint availability',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'head tipset',
					},
					{
						label: 'environment',
					},
					{
						label: 'RPC endpoint availability',
					},
					{
						label: 'latest network version',
					},
				],
				[
					{
						label: 'latest power summary',
					},
					{
						label: 'bounded recent tipset count',
					},
					{
						label: 'indexed deal count when available',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Execution',
					items: [
						{
							label: 'tipsets',
						},
						{
							label: 'timestamped network/head observations',
						},
					],
				},
				{
					label: 'Consensus & Storage Power',
					items: [
						{
							label: 'head miners from latest snapshot plus miner state observations when scoped',
						},
					],
				},
				{
					label: 'Deals',
					items: [
						{
							label: 'Filecoin deals from market state/indexer sources when wired',
						},
					],
				},
				{
					label: 'Assets',
					items: [
						{
							label: 'native coin',
						},
					],
				},
				{
					label: 'Resources',
					items: [
						{
							label: 'faucets',
						},
						{
							label: 'block explorers',
						},
						{
							label: 'source endpoints',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinNetwork>
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
	entityType={EntityType.FilecoinNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
