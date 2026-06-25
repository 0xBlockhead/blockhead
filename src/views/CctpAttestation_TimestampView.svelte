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
		'$message',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$message',
				'timestampMs',
				'source',
				'status',
				'delayReason',
			],
			[
				'forwardState',
				{
					label: 'forward transaction hash',
				},
				{
					label: 'attestation availability',
				},
				'requestId',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Message',
				items: [
					{
						label: 'parent CCTP message',
					},
				],
			},
			{
				label: 'Attestation bytes',
				items: [
					{
						label: 'signature payload',
					},
				],
			},
			{
				label: 'Forwarding',
				items: [
					{
						label: 'forward state/transaction evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Iris API response',
					},
					'requestId',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpAttestation_Timestamp>
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
	entityType={EntityType.CctpAttestation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
