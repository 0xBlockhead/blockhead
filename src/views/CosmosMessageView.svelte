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
				label: 'transaction',
			},
			{
				label: 'message index',
			},
			{
				label: 'type URL',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'message index',
					},
					{
						label: 'type URL',
					},
					{
						label: 'module name',
					},
					{
						label: 'message name',
					},
					{
						label: 'signer/sender',
					},
					{
						label: 'contract',
					},
					{
						label: 'funds count',
					},
					{
						label: 'event type count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent Cosmos transaction',
						},
					],
				},
				{
					label: 'Accounts',
					items: [
						{
							label: 'signer',
						},
						{
							label: 'sender',
						},
						{
							label: 'granter',
						},
						{
							label: 'grantee Cosmos account refs when resolved',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'CosmWasm contract for execute/instantiate/migrate messages',
						},
					],
				},
				{
					label: 'Funds',
					items: [
						{
							label: 'denom/amount table linked to Cosmos denom rows',
						},
					],
				},
				{
					label: 'Events',
					items: [
						{
							label: 'tx_response event types',
						},
						{
							label: 'attributes scoped to this message when source payloads expose message indexes',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'decoded SDK/Any JSON with module-specific fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosMessage>
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
	entityType={EntityType.CosmosMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
