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
			'blockHash',
		],
		content: {
			dl: [
				[
					'blockHash',
					'version',
					'timestampMs',
					'blueScore',
					'daaScore',
					'bits',
					'nonce',
					'hashMerkleRoot',
					'acceptedIdMerkleRoot',
					'utxoCommitment',
					'selectedParentHash',
					'parentHashes',
					'mergeSetBlues',
					'mergeSetReds',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'accepted transactions',
					when: 'open',
					items: [
						'$$acceptedTransactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaBlock>
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
	entityType={EntityType.KaspaBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
