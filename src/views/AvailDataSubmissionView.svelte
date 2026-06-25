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
		'source',
		'submissionKey',
		'appId',
	],
	content: {
		dl: [
			[
				'$network',
				'source',
				'submissionKey',
				'appId',
				'blockNumber',
			],
			[
				'extrinsicIndex',
				'transactionHash',
				'senderSelector',
			],
			[
				'dataHash',
				'commitment',
				'sizeBytes',
				{
					label: 'proof availability',
				},
				'payloadRequested',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'App id',
				items: [
					{
						label: 'parent app id when resolved',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing block when resolved',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'payload bytes only when requested',
					},
					{
						label: 'hash/size summary otherwise',
					},
				],
			},
			{
				label: 'Proof',
				items: [
					{
						label: 'proof JSON when source supports it',
					},
				],
			},
			{
				label: 'Scaling usage',
				items: [
					{
						label: 'scaling deployment claims whose DA selector references this app/submission when mapped',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'data submission extrinsic',
					},
					{
						label: 'indexer transaction payload',
					},
					{
						label: 'RPC proof/payload endpoint',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailDataSubmission>
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
	entityType={EntityType.AvailDataSubmission}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
