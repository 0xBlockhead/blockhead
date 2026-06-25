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
		'$nodeState',
		'publicKey',
		{
			label: 'latest balance',
		},
	],
	content: {
		dl: [
			[
				'$nodeState',
				'publicKey',
				{
					label: 'latest balance',
				},
				{
					label: 'latest tip',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Balance history',
				items: [
					{
						label: 'BlockheadLogosBlockchainWalletKeyState_TimestampsView',
					},
				],
			},
			{
				label: 'Node',
				items: [
					{
						label: 'BlockheadLogosBlockchainNodeStateView',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'user_config.yaml known_keys',
					},
					{
						label: '/wallet/{publicKey}/balance',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLogosBlockchainWalletKeyState>
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
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
