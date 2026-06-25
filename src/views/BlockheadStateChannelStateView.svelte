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
		'$channel',
		'version',
		'intent',
	],
	content: {
		dl: [
			[
				'$channel',
				'version',
				'intent',
				{
					label: 'final flag',
				},
				'timestamp',
			],
			[
				'allocations',
				'signatures',
				{
					label: 'state data hash/hex',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Channel',
				items: [
					{
						label: 'parent local state channel',
					},
				],
			},
			{
				label: 'Allocations',
				items: [
					{
						label: 'destination/token/amount table',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'participant co-signature list',
					},
				],
			},
			{
				label: 'Settlement evidence',
				items: [
					{
						label: 'linked checkpoint/challenge/finalization rows when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelState>
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
	entityType={EntityType.BlockheadStateChannelState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
