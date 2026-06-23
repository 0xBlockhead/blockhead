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
			'epoch',
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'epoch',
					'source',
					'slot',
					{
						label: 'quorum numerator/denominator',
					},
					{
						label: 'member count',
					},
					{
						label: 'threshold summary',
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
							label: 'parent Cardano network',
						},
					],
				},
				{
					label: 'Members',
					items: [
						{
							label: 'committee credential/expiry payload',
						},
					],
				},
				{
					label: 'Votes',
					items: [
						{
							label: 'governance votes filtered to committee voters when indexed',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'committee/local-state-query/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoCommittee_Epoch>
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
	entityType={EntityType.CardanoCommittee_Epoch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
