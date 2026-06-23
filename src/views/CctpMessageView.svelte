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
				label: 'source domain',
			},
			'nonce',
			{
				label: 'version',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'source domain',
					},
					'nonce',
					{
						label: 'version',
					},
					{
						label: 'message hash',
					},
					{
						label: 'source transaction hash/log index',
					},
					{
						label: 'destination domain',
					},
					'sender',
					'recipient',
					'amount',
					{
						label: 'burn token',
					},
					{
						label: 'mint recipient',
					},
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
						{
							label: 'hook data',
						},
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
