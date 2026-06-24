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
			label: 'referendum id',
		},
		'track',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'referendum id',
				},
				'track',
				{
					label: 'submitted block',
				},
				{
					label: 'latest lifecycle/tally observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Lifecycle',
				items: [
					{
						label: 'timestamped referendum lifecycle observations',
					},
				],
			},
			{
				label: 'Tally',
				items: [
					{
						label: 'aye/nay/support fields from latest runtime/indexer payload',
					},
				],
			},
			{
				label: 'Votes/deposits',
				items: [
					{
						label: 'vote',
					},
					{
						label: 'deposit child rows once selectors are modeled',
					},
				],
			},
			{
				label: 'Preimage/call',
				items: [
					{
						label: 'linked preimage or call metadata',
					},
				],
			},
			{
				label: 'Discussions',
				items: [
					{
						label: 'source-attributed forum/indexer links only when selectors exist',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotReferendum>
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
	entityType={EntityType.PolkadotReferendum}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
