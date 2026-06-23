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
				label: 'oracle feed',
			},
			{
				label: 'round id',
			},
			'answer',
		],
		content: {
			dl: [
				[
					{
						label: 'oracle feed',
					},
					{
						label: 'round id',
					},
					'answer',
					'startedAtMs',
					'updatedAtMs',
					'answeredInRound',
					{
						label: 'network',
					},
				],
				[
					{
						label: 'block number',
					},
					{
						label: 'transaction hash',
					},
					{
						label: 'log index',
					},
					{
						label: 'parent feed market mapping',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Feed',
					items: [
						{
							label: 'parent oracle feed',
						},
					],
				},
				{
					label: 'On-chain provenance',
					items: [
						{
							label: 'AnswerUpdated/NewRound logs or explorer coordinates',
						},
					],
				},
				{
					label: 'Contract read',
					items: [
						{
							label: 'getRoundData roundId/answer/startedAt/updatedAt/answeredInRound',
						},
					],
				},
				{
					label: 'Market context',
					items: [
						{
							label: 'parent feed market mapping',
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
			selection: EntityProxyResource<typeof schema, EntityType.OracleFeed_Round>
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
	entityType={EntityType.OracleFeed_Round}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
