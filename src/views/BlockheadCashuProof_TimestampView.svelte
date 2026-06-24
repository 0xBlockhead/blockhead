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
			label: 'proof',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'proof',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'proof Y',
				},
				'state',
				{
					label: 'witness presence',
				},
				{
					label: 'subscription id',
				},
				{
					label: 'quote id',
				},
				'method',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proof',
				items: [
					{
						label: 'BlockheadCashuProofView',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'CashuMintView through the proof',
					},
				],
			},
			{
				label: 'Witness',
				items: [
					{
						label: 'serialized witness data when present',
					},
				],
			},
			{
				label: 'Quote context',
				items: [
					{
						label: 'BlockheadCashuMintQuoteView or BlockheadCashuMeltQuoteView when linked by local context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NUT-07 check-state response or NUT-17 websocket notification',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuProof_Timestamp>
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
	entityType={EntityType.BlockheadCashuProof_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
