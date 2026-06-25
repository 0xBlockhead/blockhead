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
		'$proposal',
		'timestampMs',
		'status',
	],
	content: {
		dl: [
			[
				'$proposal',
				'timestampMs',
				'source',
				'status',
				{
					label: 'submit/deposit/voting times',
				},
				{
					label: 'metadata presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proposal',
				items: [
					{
						label: 'parent governance proposal',
					},
				],
			},
			{
				label: 'Tally snapshots',
				items: [
					{
						label: 'timestamped live/final tally observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'gov proposal payload',
					},
					{
						label: 'module-version/status enum mapping',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposal_Timestamp>
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
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
