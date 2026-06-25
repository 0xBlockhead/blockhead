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
		'$network',
		'txHash',
		'$block',
	],
	content: {
		dl: [
			[
				'$network',
				'txHash',
				'$block',
				{
					label: 'code/codespace',
				},
				'gasWanted',
			],
			[
				'gasUsed',
				{
					label: 'fee summary',
				},
				'memo',
				{
					label: 'signer count',
				},
				'signatures',
			],
			[
				'eventTypes',
				'$$messages',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Messages',
				items: [
					{
						label: 'transaction SDK message rows',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing Cosmos block',
					},
				],
			},
			{
				label: 'Execution',
				items: [
					'code',
					'codespace',
					{
						label: 'gas',
					},
					'rawLog',
					'eventTypes',
				],
			},
			{
				label: 'Auth info',
				items: [
					{
						label: 'fee amount/gas limit',
					},
					'timeoutHeight',
					'signerAddresses',
					'publicKeys',
					'signatures',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Cosmos SDK tx body/auth_info/tx_response',
					},
					{
						label: 'CometBFT inclusion payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'messages',
			label: 'messages',
			field: '$$messages',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosTransaction>
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
	entityType={EntityType.CosmosTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
