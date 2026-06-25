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
		'$relay',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$relay',
				'timestampMs',
				'source',
				{
					label: 'software/version',
				},
				'supportedNips',
			],
			[
				{
					label: 'paid/restricted flags',
				},
				'activeUsers',
				'eventsPerDay',
				'rank',
				{
					label: 'reachability',
				},
			],
			[
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'NIP-11 document',
				items: [
					{
						label: 'metadata/limitations/fees',
					},
				],
			},
			{
				label: 'Indexer metrics',
				items: [
					{
						label: 'active users/events/rank',
					},
				],
			},
			{
				label: 'Relay',
				items: [
					{
						label: 'parent Nostr relay',
					},
				],
			},
			{
				label: 'Raw evidence',
				items: [
					{
						label: 'JSON document or indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay_Timestamp>
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
	entityType={EntityType.NostrRelay_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
