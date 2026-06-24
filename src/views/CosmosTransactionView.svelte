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
			label: 'transaction hash',
		},
		{
			label: 'block',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'transaction hash',
				},
				{
					label: 'block',
				},
				{
					label: 'code/codespace',
				},
				{
					label: 'gas wanted',
				},
				{
					label: 'gas used',
				},
				{
					label: 'fee summary',
				},
				'memo',
				{
					label: 'signer count',
				},
				{
					label: 'signature count',
				},
				{
					label: 'event type count',
				},
				{
					label: 'message count',
				},
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
					{
						label: 'raw log',
					},
					{
						label: 'event types',
					},
				],
			},
			{
				label: 'Auth info',
				items: [
					{
						label: 'fee amount/gas limit',
					},
					{
						label: 'timeout height',
					},
					{
						label: 'signer addresses',
					},
					{
						label: 'public keys',
					},
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
