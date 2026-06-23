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
			'slot',
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					'slot',
					'source',
					{
						label: 'timestamp',
					},
					'status',
					{
						label: 'confirmation status',
					},
					{
						label: 'fee lamports',
					},
					{
						label: 'compute units consumed',
					},
					{
						label: 'error presence',
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
							label: 'parent Solana transaction',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'Solana block through transaction block ref',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'getTransaction/getSignatureStatuses/indexer payload',
						},
						{
							label: 'commitment/finality context',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTransaction_Timestamp>
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
	entityType={EntityType.SolanaTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
