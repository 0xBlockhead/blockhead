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
			label: 'relay host',
		},
		'slot',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'relay host',
				},
				'slot',
				{
					label: 'block hash',
				},
				{
					label: 'builder pubkey/builder ref',
				},
				{
					label: 'bid value',
				},
				{
					label: 'execution block number',
				},
				{
					label: 'execution block ref when available',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution block',
				items: [
					{
						label: 'linked EVM execution block',
					},
				],
			},
			{
				label: 'Builder',
				items: [
					{
						label: 'linked MEV builder',
					},
				],
			},
			{
				label: 'Relay',
				items: [
					{
						label: 'publishing relay host',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network consensus/MEV-Boost section',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'relay proposer_payload_delivered bidtrace fields',
					},
					{
						label: 'relay host used',
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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
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
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
