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
				label: 'DRep',
			},
			'epoch',
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'DRep',
					},
					'epoch',
					'source',
					'slot',
					{
						label: 'voting power',
					},
					{
						label: 'delegator count',
					},
					{
						label: 'active flag',
					},
					{
						label: 'registered flag',
					},
					{
						label: 'deposit',
					},
					{
						label: 'anchor URL/hash',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'DRep',
					items: [
						{
							label: 'parent Cardano DRep',
						},
					],
				},
				{
					label: 'Delegation',
					items: [
						{
							label: 'stake credential delegation summary',
						},
					],
				},
				{
					label: 'Votes',
					items: [
						{
							label: 'governance votes for the epoch',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'delegateRepresentatives/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoDRep_Timestamp>
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
	entityType={EntityType.CardanoDRep_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
