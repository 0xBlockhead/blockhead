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
		'$sourceDomain',
		'nonce',
		{
			label: 'version',
		},
	],
	content: {
		dl: [
			[
				'$sourceDomain',
				'nonce',
				{
					label: 'version',
				},
				'messageHash',
				{
					label: 'source transaction hash/log index',
				},
			],
			[
				'destinationDomain',
				'sender',
				'recipient',
				'amount',
				'burnToken',
			],
			[
				'mintRecipient',
				{
					label: 'finality thresholds',
				},
				{
					label: 'latest attestation status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Attestations',
				items: [
					{
						label: 'timestamped Iris attestation observations',
					},
				],
			},
			{
				label: 'Domain support',
				items: [
					{
						label: 'source/destination CCTP domain support when mapped',
					},
				],
			},
			{
				label: 'Source transaction',
				items: [
					{
						label: 'chain-specific transaction row when mapped',
					},
				],
			},
			{
				label: 'Message bytes/body',
				items: [
					{
						label: 'raw message',
					},
					{
						label: 'decoded body',
					},
					'hookData',
					{
						label: 'fee fields',
					},
				],
			},
			{
				label: 'Forwarding',
				items: [
					{
						label: 'forward state/tx hash from latest attestation observation',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'attestation-timestamps',
			label: 'attestation timestamps',
			field: '$$attestationTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpMessage>
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
	entityType={EntityType.CctpMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
