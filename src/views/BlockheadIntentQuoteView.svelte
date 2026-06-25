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
			label: 'quote request id',
		},
		'source',
		'providerProtocol',
	],
	content: {
		dl: [
			[
				{
					label: 'quote request id',
				},
				'source',
				{
					label: 'request hash',
				},
				'providerProtocol',
				'intentType',
			],
			[
				'$sessionAction',
				'userInteropAddress',
				{
					label: 'requested time',
				},
				'requestPayloadHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Quote observations',
				items: [
					{
						label: 'BlockheadIntentQuote_Timestamp list',
					},
				],
			},
			{
				label: 'Session action',
				items: [
					{
						label: 'BlockheadSessionActionView when linked',
					},
				],
			},
			{
				label: 'Request summary',
				items: [
					{
						label: 'normalized signed-order/filler-market request summary',
					},
					{
						label: 'raw provider request retained only when needed',
					},
				],
			},
			{
				label: 'Specialized quotes',
				items: [
					{
						label: 'SwapQuote_Timestamp or BridgeRouteQuote_Timestamp when the provider returns executable route quotes instead of intent orders',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentQuote>
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
	entityType={EntityType.BlockheadIntentQuote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
